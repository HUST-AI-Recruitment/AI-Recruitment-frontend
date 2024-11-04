import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CButton,
  CCloseButton,
  CContainer,
  CNavbar,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from 'src/components/AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'
import { cilAccountLogout } from '@coreui/icons'
import { CSidebarNav, CNavItem } from '@coreui/react'
import SimpleBar from 'simplebar-react'

// sidebar nav config
import { recruiterNavigation, candidateNavigation } from 'src/nav'

import { clearAuthData } from 'src/reducers/authReducer'

const MyAppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.changeState.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow)
  const role = useSelector((state) => state.authReducer.role)

  console.log('MyAppSidebar role: ', role)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    localStorage.removeItem('userid')
    localStorage.removeItem('expire')
    dispatch(clearAuthData())
    // TODO: Redirect to Home/Login page
  }

  const userid = useSelector((state) => state.authReducer.userid)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'setSidebarShow', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'setSidebarShow', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav
        items={role === 1 ? recruiterNavigation(userid) : candidateNavigation(userid)}
      />
      <CSidebarFooter className="border-top d-none d-lg-flex" style={{ marginLeft: '-8px' }}>
        <CSidebarNav as={SimpleBar}>
          <CNavItem as="div" className="d-flex align-items-center">
            <CIcon icon={cilAccountLogout} customClassName="nav-icon" />
            <CButton onClick={handleLogout}>Logout</CButton>
          </CNavItem>
        </CSidebarNav>
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(MyAppSidebar)