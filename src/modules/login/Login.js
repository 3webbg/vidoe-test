import React, { useEffect } from 'react'

export default function Login() {
  useEffect(() => {
    window.location.hash = '/user-login'
  }, [])

  return <div>Loading...</div>
}
