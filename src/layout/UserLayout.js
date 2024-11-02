import React from 'react'
import { AppHeader } from '../components/index'
import MyAppSidebar from 'src/components/MyAppSidebar'
import MyAppContent from 'src/components/MyAppContent'

const UserLayout = () => {
  console.log('UserLayout')
  return (
    <div>
      <MyAppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <MyAppContent />
        </div>
      </div>
    </div>
  )
}

export default UserLayout
