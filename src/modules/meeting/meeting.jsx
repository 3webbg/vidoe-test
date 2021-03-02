import React from 'react'
import * as Cookies from 'js-cookie'

import './meeting.css'
import AgoraVideoCall from '../agora-video-call'
import { AGORA_APP_ID } from '../../agora.config'
import AgoraRTMContainer from '../agora-rtm/AgoraRTMContainer'
import beActiveLogo from '../../assets/images/be-active-logo.png'
class Meeting extends React.Component {
  constructor(props) {
    super(props)
    this.videoProfile = Cookies.get('videoProfile').split(',')[0] || '480p_4'
    this.channel = Cookies.get('channel') || 'test'
    this.transcode = Cookies.get('transcode') || 'interop'
    this.attendeeMode = Cookies.get('attendeeMode') || 'video'
    this.baseMode = Cookies.get('baseMode') || 'avc'
    this.appId = AGORA_APP_ID
    if (!this.appId) {
      return alert('Get App ID first!')
    }
    this.uid = undefined
    this.token = undefined
    this.chatToggle = this.chatToggle.bind(this)
    this.state = {
      chatToggle: false,
    }
  }

  chatToggle() {
    this.setState({ chatToggle: !this.state.chatToggle })
  }

  render() {
    return (
      <div className="wrapper meeting">
        <div className="ag-header">
          <div className="ag-header-lead">
            <img className="header-logo" src={beActiveLogo} alt="logo" />
          </div>
          <div className="ag-header-msg">
            Room:&nbsp;<span id="room-name">{this.channel}</span>
          </div>
        </div>
        <div className="ag-content">
          <div className="ag-main">
            <div className="ag-container">
              <AgoraVideoCall
                videoProfile={this.videoProfile}
                channel={this.channel}
                transcode={this.transcode}
                attendeeMode={this.attendeeMode}
                baseMode={this.baseMode}
                appId={this.appId}
                uid={this.uid}
                chat={(this.channel, this.appId)}
                chatToggle={this.chatToggle}
              />
            </div>
          </div>
          <div
            className="ag-side"
            style={
              !this.state.chatToggle
                ? { display: 'none' }
                : { display: 'block' }
            }
          >
            <AgoraRTMContainer
              data={{
                appId: this.appId,
                channelName: this.channel,
                token: this.token,
              }}
            />
          </div>
        </div>
        <div className="ag-footer">
          <a className="ag-href" href="https://www.agora.io">
            <span>BeActive 2021</span>
          </a>
          <span>Talk to Support: 88888888</span>
        </div>
      </div>
    )
  }
}

export default Meeting
