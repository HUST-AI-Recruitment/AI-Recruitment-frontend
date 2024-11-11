import React from 'react'
import { CNavItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilNoteAdd, cilObjectGroup, cilListRich } from '@coreui/icons'

const recruiterNavigation = (userid) => [
  {
    component: CNavItem,
    name: '个人信息',
    to: `/user/${userid}`,
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '全部工作',
    to: '/all-jobs',
    icon: <CIcon icon={cilObjectGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '发布工作',
    to: '/job-posting',
    icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
  },
]

const candidateNavigation = (userid) => [
  {
    component: CNavItem,
    name: '个人信息',
    to: `/user/${userid}`,
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '全部工作',
    to: '/all-jobs',
    icon: <CIcon icon={cilObjectGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '个人简历',
    to: `/resume/${userid}`,
    icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '我的申请',
    to: '/application',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  },
]

export { recruiterNavigation, candidateNavigation }
