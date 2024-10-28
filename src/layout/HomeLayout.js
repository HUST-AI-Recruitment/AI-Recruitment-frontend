import React from 'react'
import { AppFooter, AppHeader } from '../components/index'
import { useState } from 'react'

const HomeLayout = () => {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div>
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <AppFooter />
      </div>
    </div>
  )
}

export default HomeLayout
