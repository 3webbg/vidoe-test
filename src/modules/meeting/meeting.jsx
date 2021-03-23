import React from 'react'
import * as Cookies from 'js-cookie'

import './meeting.css'
import AgoraVideoCall from '../agora-video-call'
import { AGORA_APP_ID } from '../../agora.config'
import AgoraRTMContainer from '../agora-rtm/AgoraRTMContainer'
import beActiveLogo from '../../assets/images/be-active-logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

class Meeting extends React.Component {
  constructor(props) {
    super(props)
    this.videoProfile = Cookies.get('videoProfile').split(',')[0] || '480p_4'
    this.channel = Cookies.get('channel') || 'test'
    this.transcode = Cookies.get('transcode') || 'interop'
    this.attendeeMode = Cookies.get('attendeeMode') || 'video'
    this.baseMode = Cookies.get('baseMode') || 'avc'
    this.userType = Cookies.get('userType') || 'user'
    this.username = Cookies.get('username') || 'username'
    this.displayMode = Cookies.get('displayMode') || 'pip'
    this.appId = AGORA_APP_ID

    if (!this.appId) {
      return alert('Get App ID first!')
    }
    this.uid = undefined
    this.token = undefined
    this.chatToggle = this.chatToggle.bind(this)
    this.setUsers = this.setUsers.bind(this)
    this.state = {
      chatToggle: localStorage.getItem('chatToggle') || false,
      users: [],
      darkTheme: localStorage.getItem('darkTheme') || false,
    }
  }

  chatToggle() {
    this.setState({ chatToggle: !this.state.chatToggle })
  }

  setUidFromUserType() {
    const randomNumber = Math.floor(Math.random() * 100000 + 1)
    if (this.userType === 'user') {
      this.uid = `user${this.username}${randomNumber}`
    } else {
      this.uid = `trainer${this.username}${randomNumber}`
    }
  }
  async setUsers(list) {
    //set users list in the local storage
    await this.setState({ users: list })
  }

  componentWillMount() {
    this.setUidFromUserType()
    this.setState({ darkTheme: localStorage.getItem('darkTheme') })
    this.setState({ chatToggle: localStorage.getItem('chatToggle') })
  }
  componentDidUpdate() {
    localStorage.setItem('darkTheme', this.state.darkTheme)
    localStorage.setItem('chatToggle', this.state.chatToggle)
  }

  render() {
    return (
      <div
        className={[
          'wrapper meeting',
          this.state.darkTheme ? 'medium_dark' : null,
        ].join(' ')}
      >
        <div className="ag-header">
          <div
            className={[
              'ag-header-lead',
              this.state.darkTheme ? 'light_dark' : null,
            ].join(' ')}
          >
            <h1 className={this.state.darkTheme ? 'light_dark' : null}>
              #BE ACTIVE
            </h1>
            {/* <img className="header-logo" src={beActiveLogo} alt="logo" /> */}
          </div>
          <div className="ag-header-msg">
            Room:&nbsp;
            <span
              id="room-name"
              className={this.state.darkTheme ? 'light_dark' : null}
            >
              {this.channel}
            </span>
            <button
              onClick={() => {
                this.setState({ darkTheme: !this.state.darkTheme })
              }}
            >
              {this.state.darkTheme ? (
                <FontAwesomeIcon icon={faMoon} />
              ) : (
                <FontAwesomeIcon icon={faSun} />
              )}
            </button>
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
                userType={this.userType}
                displayMode={this.displayMode}
                darkTheme={this.state.darkTheme}
              />
            </div>
          </div>
          <div
            className={[
              'ag-side',
              !this.state.chatToggle ? 'ag-side-colapsed' : null,
            ].join(' ')}
          >
            <AgoraRTMContainer
              data={{
                appId: this.appId,
                channelName: this.channel,
                token: this.token,
                userType: this.userType,
              }}
              setUsers={this.setUsers}
              darkTheme={this.state.darkTheme}
            />
          </div>
          <div className="break"></div>
          <div className="ag-callheads">
            {this.state.users.map((user, index) => {
              return (
                <div key={index} className="ag-callhead">
                  {user}
                </div>
              )
            })}
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
