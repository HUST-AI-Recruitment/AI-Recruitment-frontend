const checkTokenExpire = () => {
  const expire = parseInt(localStorage.getItem('expire')) || null
  if (expire !== null && Date.now() > expire) {
    alert('登录已过期，请重新登录')
    return true
  }
  return false
}

export default checkTokenExpire
