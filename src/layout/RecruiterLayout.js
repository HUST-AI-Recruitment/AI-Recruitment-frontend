import React from 'react'
import { AppHeader } from '../components/index'
import RecruiterSidebar from 'src/components/sidebar/RecruiterSidebar'
import MyAppContent from 'src/components/MyAppContent'

const RecruiterLayout = () => {
  console.log('recruiterLayout')
  return (
    <div>
      <RecruiterSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <MyAppContent />
        </div>
      </div>
    </div>
  )
}

export default RecruiterLayout
