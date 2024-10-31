import React from 'react'
import { AppHeader } from '../components/index'
import RecruiterSidebar from 'src/components/sidebar/RecruiterSidebar'

const RecruiterLayout = () => {
  console.log('recruiterLayout')
  return (
    <div>
      <RecruiterSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        {/* <div className="body flex-grow-1"><AppContent /></div> */}
      </div>
    </div>
  )
}

export default RecruiterLayout
