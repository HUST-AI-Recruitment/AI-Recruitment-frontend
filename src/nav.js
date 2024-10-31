import React from 'react'
import { CNavItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPen, cilUser } from '@coreui/icons'

const recruiterNavigation = (userid) => [
  {
    component: CNavItem,
    name: 'Profile',
    to: `/user/${userid}`,
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'New Job Posting',
    to: '/new-job-posting',
    icon: <CIcon icon={cilPen} customClassName="nav-icon" />,
  },
]

export { recruiterNavigation }
