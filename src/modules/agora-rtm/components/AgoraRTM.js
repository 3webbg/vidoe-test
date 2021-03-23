import React, { useEffect, useRef } from 'react'
import AgoraRTMStyles from '../style/AgoraRTMStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { messageTypes } from './messageTypes'

export default function AgoraRTM(props) {
  const scrollingComponent = useRef(null)
  useEffect(() => {
    scrollingComponent.current.scrollIntoView()
  }, [props.chat])

  return (
    <div
      className={[
        AgoraRTMStyles.chat_wrapper,
        props.darkTheme ? AgoraRTMStyles.dark : null,
      ].join(' ')}
    >
      <div className={AgoraRTMStyles.bubble_holder}>
        {props.chat.map((messageData, index) => {
          return (
            <div className={AgoraRTMStyles.message_holder}>
              <div className={AgoraRTMStyles.chat_time}>
                {messageData?.date?.toString()}
              </div>
              {messageData.user !== 'You' &&
                messageData.type !== messageTypes.CHANNEL_EVENT && (
                  <span className={AgoraRTMStyles.chathead}>
                    {messageData.user
                      .split('_')
                      .map((name) => name.substring(0, 1).toUpperCase())}
                  </span>
                )}
              <div
                key={index}
                className={[
                  AgoraRTMStyles.bubble,
                  messageData.type !== messageTypes.CHANNEL_EVENT
                    ? messageData.type === messageTypes.CHANNEL_MESSAGE
                      ? props.darkTheme
                        ? AgoraRTMStyles.chat_bubble
                        : AgoraRTMStyles.chat_bubble_dark
                      : AgoraRTMStyles.self_chat_bubble
                    : AgoraRTMStyles.channel_bubble,
                ].join(' ')}
              >
                <span className={AgoraRTMStyles.chat_message}>
                  {messageData.message}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={scrollingComponent}></div>
      </div>
      <div
        className={[
          AgoraRTMStyles.text_field,
          props.darkTheme ? AgoraRTMStyles.dark : null,
        ].join(' ')}
      >
        <form
          onSubmit={(e) => {
            props.sendChannelMessage(e, props.chatText)
          }}
        >
          <input
            required={true}
            placeholder="send message..."
            className={AgoraRTMStyles.text_input}
            value={props.chatText}
            onChange={(e) => props.setChatText(e.target.value)}
          />
          <button type="submit" className={AgoraRTMStyles.send_text}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
        </form>
      </div>
    </div>
  )
}
