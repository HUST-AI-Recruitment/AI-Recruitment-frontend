import React from 'react'
import { CNavItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilNoteAdd, cilObjectGroup } from '@coreui/icons'

const recruiterNavigation = (userid) => [
  {
    component: CNavItem,
    name: 'Profile',
    to: `/user/${userid}`,
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'All Jobs',
    to: '/all-jobs',
    icon: <CIcon icon={cilObjectGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'New Job Posting',
    to: '/new-job-posting',
    icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
  },
]

const candidateNavigation = (userid) => [
  {
    component: CNavItem,
    name: 'Profile',
    to: `/user/${userid}`,
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

export { recruiterNavigation, candidateNavigation }
