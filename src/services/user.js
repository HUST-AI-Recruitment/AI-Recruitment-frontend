const checkTokenExpire = () => {
  const expire = parseInt(localStorage.getItem('expire')) || null
  if (expire !== null && Date.now() > expire) {
    alert('Token expired')
    return true
  }
  return false
}

export default checkTokenExpire
