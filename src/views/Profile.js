import React, { useEffect } from 'react'
import { CButton, CForm, CFormInput, CFormSelect, CCol } from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { setUsername } from 'src/reducers/authReducer'
import { useParams } from 'react-router-dom'

const Profile = () => {
  console.log('Profile')
  const dispatch = useDispatch()
  const [validated, setValidated] = React.useState(false)

  // const userid = useSelector((state) => state.authReducer.userid)
  const id = parseInt(useParams().id)
  const userid = useSelector((state) => state.authReducer.userid)
  console.log('id', id)
  console.log('userid', userid)

  const token = useSelector((state) => state.authReducer.token)

  const getUrl = 'https://api.recruitment.kkkstra.cn/api/v1/user/' + id + '/profile'
  const putUrl = 'https://api.recruitment.kkkstra.cn/api/v1/user/' + id + '/profile'
  // const deleteUrl = 'https://api.recruitment.kkkstra.cn/api/v1/user/me'

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  // const [oldPassword, setOldPassword] = React.useState('')
  // const [newPassword, setNewPassword] = React.useState('')
  // const [repeatPassword, setRepeatPassword] = React.useState('')
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
      setName(profile.username)
      if (id === userid) {
        dispatch(setUsername(profile.username))
        localStorage.setItem('username', profile.username)
      }
      setEmail(profile.email)
      setAge(profile.age)
      setDegree(profile.degree)
    }
    fetchData()
  }, [getUrl, token, dispatch, id, userid])

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
        username: name,
        email: email,
        age: age,
        degree: degree,
      }),
    })
    if (response.ok) {
      alert('信息更新成功')
    } else {
      alert('信息更新失败')
    }
  }

  // const handleDelete = async () => {
  //   const response = await fetch(deleteUrl, {
  //     method: 'DELETE',
  //     headers: {
  //       Authorization: 'Bearer ' + token,
  //     },
  //   })
  //   if (response.ok) {
  //     alert('账户删除成功')
  //   } else {
  //     alert('账户删除失败')
  //   }
  // }

  return (
    <>
      <CForm className="row g-3" noValidate validated={validated} onSubmit={handleSubmit}>
        <CCol md={6} className="mb-3">
          <CFormInput
            feedbackInvalid="用户名长度应在2-255字符之间"
            type="text"
            label="用户名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={id !== userid}
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormInput
            feedbackInvalid="请输入正确的邮箱"
            type="email"
            label="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={id !== userid}
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormInput
            feedbackInvalid="年龄应为0-150之间的整数"
            type="number"
            inputMode="numeric"
            label="年龄"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            required
            disabled={id !== userid}
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormSelect
            feedbackInvalid="请选择您的学位"
            label="学位"
            value={degree}
            onChange={(e) => {
              setDegree(e.target.value ? parseInt(e.target.value) : 0)
              e.target.blur()
            }}
            required
            disabled={id !== userid}
          >
            <option value="">选择学位</option>
            <option value={1}>学士</option>
            <option value={2}>硕士</option>
            <option value={3}>博士</option>
          </CFormSelect>
        </CCol>
        {id === userid && (
          <div className="mb-3">
            <CButton type="submit" color="primary">
              保存
            </CButton>
          </div>
        )}
      </CForm>
      {/* {id === userid && (
        <>
          <hr />
          <CButton color="danger" onClick={handleDelete}>
            删除账户
          </CButton>
        </>
      )} */}
    </>
  )
}

export default Profile
