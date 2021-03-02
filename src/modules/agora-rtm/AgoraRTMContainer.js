import React, { useRef, useState, useEffect } from 'react'
import AgoraRTM from './components/AgoraRTM'
import RTMClient from './components/RTMClient'
import AgoraRTMStyles from './style/AgoraRTMStyle.module.css'
import * as Cookies from 'js-cookie'
import useSound from 'use-sound'
import notification from '../../assets/sounds/notification.mp3'
import sendMessage from '../../assets/sounds/sendMessage.mp3'

export default function AgoraRTMContainer(props) {
  const rtm = useRef(new RTMClient())

  const [chat, setChat] = useState([])

  const [chatText, setChatText] = useState('')

  const [logined, setlogined] = useState(false)

  const [joined, setJoined] = useState(false)

  const [playNotifySound] = useSound(notification, { volume: 0.5 })

  const [playSendMessageSound] = useSound(sendMessage)

  const data = props.data
  data.name = Cookies.get('username')

  useEffect(() => {
    async function logIn() {
      await login()
    }
    logIn()
  }, [])
  rtm.current.on('ConnectionStateChanged', (newState, reason) => {
    console.log('reason:', reason)
  })

  rtm.current.on('MemberJoined', ({ channelName, args }) => {
    const memberID = args[0]
    console.log('channel:', channelName, 'member joined:', memberID)
    const jsx = (
      <div
        className={AgoraRTMStyles.chat_bubble}
      >{`${memberID} joined channel ${channelName}`}</div>
    )
    setChat([...chat, jsx])
  })
  rtm.current.on('MemberLeft', ({ channelName, args }) => {
    const memberID = args[0]
    console.log('channel:', channelName, 'member left:', memberID)
    const jsx = (
      <div
        className={AgoraRTMStyles.chat_bubble}
      >{`${memberID} left channel ${channelName}`}</div>
    )
    setChat([...chat, jsx])
  })

  rtm.current.on('ChannelMessage', async ({ channelName, args }) => {
    const [message, memberId] = args

    const jsx = (
      <div className={AgoraRTMStyles.chat_bubble}>
        <span>{`${memberId}: `}</span>
        {`${message.text}`}
      </div>
    )
    setChat([...chat, jsx])
    playNotifySound()
  })

  const login = async (e) => {
    if (rtm.current._logined) {
      return
    }

    try {
      rtm.current.init(data.appId)

      rtm.current
        .login(data.name, data.token)
        .then(async () => {
          rtm.current._logined = true
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
    if (!rtm.current._logined) {
      return
    }

    rtm.current
      .logout()
      .then(() => {
        rtm.current._logined = false
        setlogined(false)
      })
      .catch((err) => {
        alert('Logout failed')
        console.log(err)
      })
  }

  const join = async (e) => {
    if (
      rtm.current.channels[data.channelName] ||
      (rtm.current.channels[data.channelName] &&
        rtm.current.channels[data.channelName].joined)
    ) {
      console.log('you already joined')
      return
    }

    rtm.current
      .joinChannel(data.channelName)
      .then(() => {
        const jsx = (
          <div className={AgoraRTMStyles.chat_bubble}>
            {`${rtm.current.accountName} joined ${[data.channelName]}`}
          </div>
        )
        setChat([...chat, jsx])
        setJoined(true)
        rtm.current.channels[data.channelName].joined = true
      })
      .catch((err) => {
        alert('joining channel failed')
        console.log(err)
      })
  }

  const leave = (e) => {
    if (!rtm.current._logined) {
      alert('login first')
    }

    if (
      !rtm.current.channels[data.channelName] ||
      (rtm.current.channels[data.channelName] &&
        !rtm.current.channels[data.channelName].joined)
    ) {
      alert('You already left')
    }

    rtm.current
      .leaveChannel(data.name)
      .then(() => {
        const jsx = (
          <div className={AgoraRTMStyles.chat_bubble}>
            {`${rtm.current.accountName} joined ${
              rtm.current.channels[data.channelName]
            }`}
          </div>
        )
        setChat([...chat, jsx])
        rtm.current.channels[data.channelName].joined = false
        rtm.current.channels[data.channelName] = null
      })
      .catch((err) => {
        alert('leaving channel failed')
        console.log(err)
      })
  }

  const sendChannelMessage = (e, chatParams) => {
    e.preventDefault()

    if (!rtm.current._logined) {
      return
    }
    if (
      !rtm.current.channels[data.channelName] ||
      (rtm.current.channels[data.channelName] &&
        !rtm.current.channels[data.channelName].joined)
    ) {
      join()
    }

    rtm.current
      .sendChannelMessage(chatParams, data.channelName)
      .then(() => {
        const jsx = (
          <div className={AgoraRTMStyles.chat_bubble}>
            <span>{`${rtm.current.accountName}: `}</span>
            {`${chatParams}`}
          </div>
        )
        setChat([...chat, jsx])
        playSendMessageSound()
        setChatText('')
      })
      .catch((err) => {
        alert('sending message failed,')
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
      leave={leave}
      sendChannelMessage={sendChannelMessage}
      chatText={chatText}
      setChatText={setChatText}
      rtm={rtm.current}
      data={data}
    />
  )
}
