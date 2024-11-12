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
  const baseUrl = 'https://api.recruitment.kkkstra.cn/api/v1/session'
  const countdown = 3000
  const dispatch = useDispatch()
  const userid = useSelector((state) => state.authReducer.userid)

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!username || !password) {
      setErrorMessages('请填写您的用户名密码进行登录')
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
        }),
      })
      const data = await response.json()
      if (response.ok) {
        let auth = data['data']
        console.log('auth:', auth)
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
                  <CForm onSubmit={handleLogin}>
                    <h1>登录</h1>
                    <p className="text-body-secondary">登录您的账户</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        feedbackInvalid="请填写正确的用户名"
                        placeholder="用户名"
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)}
                        minLength={2}
                        maxLength={255}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        feedbackInvalid="密码错误"
                        type="password"
                        placeholder="密码"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        maxLength={255}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          登录
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right d-none">
                        <CButton color="link" className="px-0">
                          忘记密码？
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-4" style={{ width: '44%' }}>
                <CCardBody
                  className="text-center"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <h2>还没有账户？</h2>
                  <p>若您在本站还没有账户，请点击下方按钮进行注册！</p>
                  <Link to="/register" style={{ marginTop: 'auto' }}>
                    <CButton color="primary" className="mt-3 px-4" active tabIndex={-1}>
                      注册
                    </CButton>
                  </Link>
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
