import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import AgoraRTM from './components/AgoraRTM'
import RTMClient from './components/RTMClient'
import AgoraRTMStyles from './style/AgoraRTMStyle.module.css'
import * as Cookies from 'js-cookie'
import useSound from 'use-sound'
import notification from '../../assets/sounds/ICQ Uh Oh Sound.mp3'
import sendMessage from '../../assets/sounds/sendMessage.mp3'
import { messageTypes } from './components/messageTypes'

const RTM = new RTMClient()

export default function AgoraRTMContainer(props) {
  const rtm = RTM

  const [chat, setChat] = useState([])

  const [chatText, setChatText] = useState('')

  const [message, setMessage] = useState()

  const [logined, setlogined] = useState(false)

  const [joined, setJoined] = useState(false)

  const [playNotifySound] = useSound(notification, { volume: 0.5 })

  const [playSendMessageSound] = useSound(sendMessage)

  const data = props.data

  data.name = Cookies.get('username')

  function formatDate(date) {
    return `${date.getHours()}:${date.getMinutes()}`
  }

  function onChannelMessage(data) {
    let messageData = data.args[0]
    const date = new Date()
    if (messageData.messageType === 'TEXT') {
      setMessage({
        user: data.args[1],
        message: messageData.text,
        type: messageTypes.CHANNEL_MESSAGE,
        date: formatDate(date),
      })
    }
  }

  const getUsers = () => {
    if (rtm.channels[data.channelName].joined) {
      rtm.channels[data.channelName].channel
        .getMembers()
        .then((users) => {
          props.setUsers(users)
        })
        .catch((err) => console.log(err))
    }
  }

  useEffect(() => {
    if (message) {
      if (message.user !== 'You') {
        playNotifySound()
      }
      setChat([...chat, message])
    }
  }, [message])

  useEffect(() => {
    rtm.on('ChannelMessage', (data) => {
      onChannelMessage(data)
      getUsers()
    })

    rtm.on('MemberJoined', ({ channelName, args }) => {
      const memberID = args[0]
      const date = new Date()

      console.log('channel:', channelName, 'member joined:', memberID)

      setMessage({
        user: null,
        message: `${memberID} joined channel ${channelName}`,
        type: messageTypes.CHANNEL_EVENT,
        date: formatDate(date),
      })
      getUsers()
    })

    rtm.on('MemberLeft', ({ channelName, args }) => {
      const memberID = args[0]
      const date = new Date()
      console.log('channel:', channelName, 'member left:', memberID)
      setMessage({
        user: null,
        message: `${memberID} left channel ${channelName}`,
        type: messageTypes.CHANNEL_EVENT,
        date: formatDate(date),
      })
      getUsers()
    })
  }, [])

  rtm.on('ConnectionStateChanged', (newState, reason) => {
    console.log('reason:', reason)
    getUsers()
  })

  useEffect(() => {
    async function logIn() {
      await login()
    }
    logIn()

    return () => {
      //leaving channel on component dismount
      leave()
      logout()
    }
  }, [])

  const login = async (e) => {
    if (rtm._logined) {
      return
    }

    try {
      rtm.init(data.appId)

      rtm
        .login(data.name, data.token)
        .then(async () => {
          rtm._logined = true
          setlogined(true)
          await join()
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (err) {
      alert(`login failed`)
      console.log(err)
    }
  }

  const logout = (e) => {
    if (!rtm._logined) {
      return
    } else {
      rtm
        .logout()
        .then(() => {
          rtm._logined = false
          setlogined(false)
          Cookies.remove('channel')
          Cookies.remove('username')
          Cookies.remove('userType')
          Cookies.remove('videoProfile')
          Cookies.remove('baseMode')
        })
        .catch((err) => {
          console.log('Logout failed')
          console.log(err)
        })
    }
  }

  const join = async (e) => {
    if (
      rtm.channels[data.channelName] ||
      (rtm.channels[data.channelName] && rtm.channels[data.channelName].joined)
    ) {
      console.log('you already joined')
      return
    }

    rtm
      .joinChannel(data.channelName)
      .then(() => {
        const date = new Date()
        setMessage({
          user: null,
          message: `${rtm.accountName} joined channel ${[data.channelName]}`,
          type: messageTypes.CHANNEL_EVENT,
          date: formatDate(date),
        })
        setJoined(true)
        rtm.channels[data.channelName].joined = true
        getUsers()
      })
      .catch((err) => {
        alert('joining channel failed')
        console.log(err)
      })
  }

  const leave = (e) => {
    if (!rtm._logined) {
      console.log('login first')
      return
    }

    if (
      !rtm.channels[data.channelName] ||
      (rtm.channels[data.channelName] && !rtm.channels[data.channelName].joined)
    ) {
      console.log('You already left')
      return
    }

    rtm
      .leaveChannel(data.name)
      .then(() => {
        const date = new Date()
        setMessage({
          user: null,
          message: `${rtm.accountName} left ${rtm.channels[data.channelName]}`,
          type: messageTypes.CHANNEL_EVENT,
          date: formatDate(date),
        })
        rtm.channels[data.channelName].joined = false
        rtm.channels[data.channelName] = null
      })
      .catch((err) => {
        console.log('leaving channel failed')
        console.log(err)
      })
  }

  const sendChannelMessage = (e, chatParams) => {
    e.preventDefault()

    if (!rtm._logined) {
      return
    }
    if (
      !rtm.channels[data.channelName] ||
      (rtm.channels[data.channelName] && !rtm.channels[data.channelName].joined)
    ) {
      join()
      return
    }

    rtm
      .sendChannelMessage(chatParams, data.channelName)
      .then(() => {
        const date = new Date()
        setMessage({
          user: 'You',
          message: chatParams,
          type: messageTypes.USER_MESSAGE,
          date: formatDate(date),
        })
        playSendMessageSound()
        setChatText('')
        getUsers()
      })
      .catch((err) => {
        console.log('sending message failed,')
        console.log(err)
      })
  }

  return (
    <AgoraRTM
      {...props}
      chat={chat}
      login={login}
      logout={logout}
      join={join}
      sendChannelMessage={sendChannelMessage}
      chatText={chatText}
      setChatText={setChatText}
      rtm={rtm}
      data={data}
      darkTheme={props.darkTheme}
    />
  )
}
