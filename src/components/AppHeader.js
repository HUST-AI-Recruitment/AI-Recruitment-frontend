import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilContrast, cilMenu, cilMoon, cilSun } from '@coreui/icons'

// import { AppBreadcrumb } from './index'

import checkTokenExpire from 'src/services/user'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthData } from 'src/reducers/authReducer'

const AppHeader = () => {
  const headerRef = useRef()
  const navigate = useNavigate()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow)
  const sidebarUnfoldable = useSelector((state) => state.changeState.sidebarUnfoldable)

  const token = useSelector((state) => state.authReducer.token)
  const username = useSelector((state) => state.authReducer.username)
  const userid = useSelector((state) => state.authReducer.userid)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (checkTokenExpire()) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      localStorage.removeItem('userid')
      localStorage.removeItem('expire')
      dispatch(clearAuthData())
      setLoggedIn(false)
      navigate('/login')
    }
  }, [dispatch, navigate])

  useEffect(() => {
    setLoggedIn(token ? true : false)
    if (token === null) {
      navigate('/home')
    }
  }, [token, navigate])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const handleProfileClick = () => {
    navigate(`/user/${userid}`)
  }

  const handleToggleSidebar = () => {
    dispatch({ type: 'setSidebarShow', sidebarShow: !sidebarShow })
    if (sidebarUnfoldable) {
      dispatch({ type: 'setSidebarUnfoldable', sidebarUnfoldable: false })
    }
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler onClick={handleToggleSidebar} style={{ marginInlineStart: '-14px' }}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="ms-auto" style={{ visibility: 'hidden' }}></CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          {/* <AppHeaderDropdown /> */}
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            {loggedIn ? (
              <CNavLink onClick={handleProfileClick}>{username}</CNavLink>
            ) : (
              <CNavLink to="/login" as={NavLink}>
                Login
              </CNavLink>
            )}
          </CNavItem>
        </CHeaderNav>
      </CContainer>
      {/* <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer> */}
    </CHeader>
  )
}

export default AppHeader
