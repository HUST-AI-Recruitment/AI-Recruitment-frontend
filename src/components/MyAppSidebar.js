import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CButton,
  CCloseButton,
  CContainer,
  CNavbar,
  CNavLink,
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
import { CNavItem } from '@coreui/react'

// sidebar nav config
import { recruiterNavigation, candidateNavigation } from 'src/nav'

import { clearAuthData } from 'src/reducers/authReducer'
import { useNavigate } from 'react-router-dom'

const MyAppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.changeState.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow)
  const role = useSelector((state) => state.authReducer.role)
  const navigate = useNavigate()

  console.log('MyAppSidebar role: ', role)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    localStorage.removeItem('userid')
    localStorage.removeItem('expire')
    dispatch(clearAuthData())
    navigate('/home')
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
          {/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} /> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
          <div className="sidebar-brand-full" style={{ fontSize: '1.2rem' }}>
            AI Recruitment
          </div>
          <div className="sidebar-brand-narrow" style={{ fontSize: '1.2rem' }}>
            AI
          </div>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'setSidebarShow', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={role === 1 ? recruiterNavigation(userid) : candidateNavigation(userid)}>
        <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <CNavItem as="div">
            <CNavLink>
              <CIcon icon={cilAccountLogout} customClassName="nav-icon" />
              <CButton onClick={handleLogout} style={{ margin: '4px', padding: 0 }}>
                Logout
              </CButton>
            </CNavLink>
          </CNavItem>
        </div>
      </AppSidebarNav>
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'setSidebarUnfoldable', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(MyAppSidebar)
