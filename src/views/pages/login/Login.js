import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import checkTokenExpire from 'src/services/user'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthData, clearAuthData } from 'src/reducers/authReducer'

const Login = () => {
  const navigate = useNavigate()
  const [errorMessages, setErrorMessages] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(1)
  const baseUrl = 'https://api.recruitment.kkkstra.cn/api/v1/session'
  const countdown = 3000
  const dispatch = useDispatch()
  const userid = useSelector((state) => state.authReducer.userid)

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!username || !password || !role) {
      setErrorMessages('Please fill in all fields')
      setTimeout(() => {
        setErrorMessages(null)
      }, countdown)
      return
    }
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          role: role,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        let auth = data['data']
        console.log('auth:', auth)
        auth['role'] = role
        auth['username'] = username
        auth['userid'] = auth['id']
        auth['expire'] = auth['expire'] * 1000 + Date.now()
        localStorage.setItem('token', auth['token'])
        localStorage.setItem('expire', auth['expire'])
        localStorage.setItem('userid', auth['userid'])
        localStorage.setItem('username', auth['username'])
        localStorage.setItem('role', auth['role'])
        dispatch(setAuthData(auth))
        navigate(`/user/${auth['userid']}`)
      } else {
        console.error(data.message)
      }
    } catch (error) {
      setErrorMessages(error.message)
      setTimeout(() => {
        setErrorMessages(null)
      }, countdown)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const expire = localStorage.getItem('expire')
    if (token && expire) {
      if (!checkTokenExpire()) navigate(`/user/${userid}`)
      else {
        localStorage.removeItem('token')
        localStorage.removeItem('expire')
        localStorage.removeItem('userid')
        localStorage.removeItem('username')
        localStorage.removeItem('role')
        dispatch(clearAuthData())
      }
    }
  }, [userid, dispatch, navigate])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (errorMessages) setVisible(true)
    else setVisible(false)
  }, [errorMessages])

  console.log('username:', username)
  console.log('password:', password)
  console.log('role:', role)

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CAlert color="danger" dismissible visible={visible} onClose={() => setVisible(false)}>
          {errorMessages}
        </CAlert>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        paddingBottom: '16px',
                      }}
                    >
                      <CFormCheck
                        inline
                        type="radio"
                        name="role"
                        value="1"
                        label="我是招聘方"
                        style={{ flex: 1 }}
                        checked={role === 1}
                        onChange={(e) => setRole(parseInt(e.target.value))}
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="role"
                        value="2"
                        label="我是求职者"
                        style={{ flex: 1 }}
                        checked={role === 2}
                        onChange={(e) => setRole(parseInt(e.target.value))}
                      />
                    </div>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleLogin}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right d-none">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
