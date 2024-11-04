import React, { useEffect } from 'react'
import {
  CButton,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CCol,
  CCardTitle,
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { setUsername } from 'src/reducers/authReducer'
import { string } from 'prop-types'

const Profile = () => {
  console.log('Profile')
  const dispatch = useDispatch()
  const [validated, setValidated] = React.useState(false)

  const userid = useSelector((state) => state.authReducer.userid)
  const token = useSelector((state) => state.authReducer.token)

  const getUrl = 'https://api.recruitment.kkkstra.cn/api/v1/user/' + userid + '/profile'
  const putUrl = 'https://api.recruitment.kkkstra.cn/api/v1/user/me'
  const deleteUrl = 'https://api.recruitment.kkkstra.cn/api/v1/user/me'

  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [oldPassword, setOldPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [repeatPassword, setRepeatPassword] = React.useState('')
  const [age, setAge] = React.useState('')
  const [degree, setDegree] = React.useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(getUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      const data = await response.json()
      const profile = data['data']['profile']
      setUsername(profile.username)
      setEmail(profile.email)
      setAge(profile.age)
      setDegree(profile.degree)
    }
    fetchData()
  }, [getUrl, token])

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
      return
    }
    event.preventDefault()
    const response = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        age: age,
        degree: degree,
      }),
    })
    if (response.ok) {
      alert('Profile updated')
    } else {
      alert('Profile update failed')
    }
  }

  const handleDelete = async () => {
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    if (response.ok) {
      alert('Account deleted')
    } else {
      alert('Account deletion failed')
    }
  }

  return (
    <>
      <CForm className="row g-3" noValidate validated={validated} onSubmit={handleSubmit}>
        <CCol md={6} className="mb-3">
          <CFormInput
            type="text"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormInput
            type="text"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormInput
            type="text"
            label="Age"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            required
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormSelect
            feedbackInvalid="Please select a degree."
            label="Degree"
            value={degree}
            onChange={(e) => {
              setDegree(parseInt(e.target.value))
              e.target.blur()
            }}
            valid={validated && degree !== 0}
            invalid={validated && degree === 0}
            required
          >
            <option value={0}>Select a degree</option>
            <option value={1}>Bachelor</option>
            <option value={2}>Master</option>
            <option value={3}>PhD</option>
          </CFormSelect>
        </CCol>
        <div className="mb-3">
          <CButton type="submit" color="primary">
            Save
          </CButton>
        </div>
      </CForm>
      <hr />
      <CButton color="danger" onClick={handleDelete}>
        Delete Account
      </CButton>
    </>
  )
}

export default Profile
