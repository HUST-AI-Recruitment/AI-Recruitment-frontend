import React from 'react'
import { CNavItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilNoteAdd, cilObjectGroup, cilListRich } from '@coreui/icons'

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
    name: 'Job Posting',
    to: '/job-posting',
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
  {
    component: CNavItem,
    name: 'All Jobs',
    to: '/all-jobs',
    icon: <CIcon icon={cilObjectGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Resume',
    to: `/resume/${userid}`,
    icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Application',
    to: '/application',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  },
]

export { recruiterNavigation, candidateNavigation }
