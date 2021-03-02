import React from 'react'
import AgoraRTMStyles from '../style/AgoraRTMStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function AgoraRTM(props) {
  return (
    <div className={AgoraRTMStyles.chat_wrapper}>
      <div className={AgoraRTMStyles.bubble_holder}>
        {props.chat.map((text, index) => {
          return (
            <div className={AgoraRTMStyles.bubble} key={index}>
              {text}
            </div>
          )
        })}
      </div>
      <div className={AgoraRTMStyles.text_field}>
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
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </form>
      </div>
    </div>
  )
}
