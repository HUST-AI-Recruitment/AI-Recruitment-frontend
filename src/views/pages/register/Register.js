import React, { useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CFormCheck,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilEducation } from '@coreui/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [repeatPassword, setRepeatPassword] = React.useState('')
  const [role, setRole] = React.useState(1)
  const [age, setAge] = React.useState(0)
  const [degree, setDegree] = React.useState('')
  const [errorMessages, setErrorMessages] = useState(null)
  const [visible, setVisible] = useState(false)
  const baseUrl = 'https://api.recruitment.kkkstra.cn/api/v1/user'
  const countdown = 3000

  const handleRegister = async (event) => {
    event.preventDefault()
    if (!username || !email || !password || !repeatPassword || !role || !age || !degree) {
      setErrorMessages('Please fill in all fields')
      setTimeout(() => {
        setErrorMessages(null)
      }, countdown)
      return
    }
    if (password !== repeatPassword) {
      setErrorMessages('Password and repeat password not match')
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
          email: email,
          password: password,
          role: role,
          age: age,
          degree: degree,
        }),
      })
      console.log(response)
      if (response.ok) {
        alert('Register success')
        navigate('/login')
      } else {
        alert('Register failed')
      }
    } catch (error) {
      console.error(error)
    }
  }

  console.log('username', username)
  console.log('email', email)
  console.log('password', password)
  console.log('repeatPassword', repeatPassword)
  console.log('role', role)
  console.log('age', age)
  console.log('degree', degree)

  useEffect(() => {
    if (errorMessages) setVisible(true)
    else setVisible(false)
  }, [errorMessages])

  const handleAgeChange = (e) => {
    const inputValue = e.target.value
    const numericValue = parseInt(inputValue.replace(/\D/g, ''))
    let value = null
    if (numericValue) {
      value = Math.max(1, numericValue)
    } else {
      value = ''
    }
    setAge(value)
    e.target.value = value
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CAlert color="danger" dismissible visible={visible} onClose={() => setVisible(false)}>
          {errorMessages}
        </CAlert>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
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
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Age" onChange={handleAgeChange} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEducation} />
                    </CInputGroupText>
                    <CFormSelect onChange={(e) => setDegree(parseInt(e.target.value))}>
                      <option value="">Degree</option>
                      <option value="1">Bachelor</option>
                      <option value="2">Master</option>
                      <option value="3">PhD</option>
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" onClick={handleRegister}>
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
