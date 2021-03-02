import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './common/Layout'
import * as serviceWorker from './serviceWorker'

const polyfill = (() => {
  // Object.entries
  if (!Object.entries)
    Object.entries = function (obj) {
      var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i) // preallocate the Array
      while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]]

      return resArray
    }
})()

ReactDOM.render(<Layout />, document.getElementById('root'))
//vdfhgb
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
