import { CAlert } from '@coreui/react'

const checkTokenExpire = () => {
  const loggedUserJSON = localStorage.getItem('loggedUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    const currentTime = new Date().getTime()
    const expireTime = new Date(user.expire).getTime()
    if (currentTime > expireTime) {
      handleLogout()
      CAlert('Session expired, please login again.')
      return true
    }
    return false
  }
}

export const handleLogout = () => {
  localStorage.removeItem('loggedUser')
}

export default checkTokenExpire
