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
  const [role, setRole] = React.useState(0)
  const [age, setAge] = React.useState(0)
  const [degree, setDegree] = React.useState(0)
  const [errorMessages, setErrorMessages] = useState(null)
  const [visible, setVisible] = useState(false)
  const baseUrl = 'https://api.recruitment.kkkstra.cn/api/v1/user'
  const countdown = 3000
  // const [validated, setValidated] = React.useState(false)
  const testEmail = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i

  const handleRegister = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
      setErrorMessages('请填写所有必填项')
      // setValidated(true)
      setTimeout(() => {
        setErrorMessages(null)
      }, countdown)
      return
    }
    if (password !== repeatPassword) {
      setErrorMessages('两次密码不一致')
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
        alert('注册成功')
        navigate('/login')
      } else {
        alert('注册失败')
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
    console.log('numericValue', numericValue)
    let value = null
    if (numericValue || numericValue === 0) {
      value = Math.max(0, numericValue)
    } else {
      value = 0
    }
    console.log('value', value)
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
                <CForm onSubmit={handleRegister} noValidate>
                  <h1>注册</h1>
                  <p className="text-body-secondary">创建您的账户</p>
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
                      invalid={role === 0}
                      valid={role !== 0}
                      required
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
                      invalid={role === 0}
                      valid={role !== 0}
                      required
                    />
                  </div>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      feedbackInvalid="用户名长度应在 2-255 字符之间"
                      placeholder="用户名"
                      autoComplete="username"
                      onChange={(e) => setUsername(e.target.value)}
                      minLength={2}
                      maxLength={255}
                      valid={username.length >= 2 && username.length <= 255}
                      invalid={username.length < 2 || username.length > 255}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      feedbackInvalid="年龄大小应为 0-150 之间的整数"
                      placeholder="年龄"
                      onChange={handleAgeChange}
                      inputMode="numeric"
                      type="text"
                      min={0}
                      max={150}
                      value={age}
                      invalid={age < 0 || age > 150}
                      valid={age >= 0 && age <= 150}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEducation} />
                    </CInputGroupText>
                    <CFormSelect
                      feedbackInvalid="请选择教育情况"
                      onChange={(e) => setDegree(e.target.value ? parseInt(e.target.value) : 0)}
                      invalid={degree === 0}
                      valid={degree !== 0}
                      required
                    >
                      <option value="">教育情况</option>
                      <option value="1">学士</option>
                      <option value="2">硕士</option>
                      <option value="3">博士</option>
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      feedbackInvalid="请填写正确的邮箱"
                      placeholder="邮箱"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={255}
                      invalid={!testEmail.test(email)}
                      type="email"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      feedbackInvalid="密码长度应至少 6 位"
                      type="password"
                      placeholder="密码"
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      maxLength={255}
                      invalid={password.length < 6 || password.length > 255}
                      valid={password.length >= 6 && password.length <= 255}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      feedbackInvalid="请确认您的密码"
                      type="password"
                      placeholder="确认密码"
                      autoComplete="new-password"
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      minLength={6}
                      maxLength={255}
                      invalid={
                        repeatPassword.length < 6 ||
                        repeatPassword.length > 255 ||
                        repeatPassword !== password
                      }
                      valid={
                        repeatPassword.length >= 6 &&
                        repeatPassword.length <= 255 &&
                        repeatPassword === password
                      }
                      required
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit" className="text-white">
                      创建
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
