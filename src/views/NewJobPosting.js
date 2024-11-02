import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CButton, CCol, CForm, CFormInput, CFormTextarea } from '@coreui/react'

const NewJobPosting = () => {
  const navigate = useNavigate()
  const role = useSelector((state) => state.authReducer.role)
  const postUrl = 'https://api.recruitment.kkkstra.cn/api/v1/jobs'
  const token = useSelector((state) => state.authReducer.token)

  console.log('role', role)

  useEffect(() => {
    if (role !== 1) {
      alert('You are not authorized to view this page')
      navigate(-1)
    }
  }, [role, navigate])

  const [validated, setValidated] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [demand, setDemand] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [salary, setSalary] = React.useState('')
  const [job_type, setJobType] = React.useState('')

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
      return
    }
    event.preventDefault()
    const response = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        demand: demand,
        location: location,
        company: company,
        salary: salary,
        job_type: job_type,
      }),
    })
    if (response.ok) {
      alert('Job posting created successfully')
      setTitle('')
      setDescription('')
      setDemand('')
      setLocation('')
      setCompany('')
      setSalary('')
      setJobType('')
    } else {
      alert('Job posting creation failed')
    }
  }

  return (
    <>
      <CForm className="row g-3" noValidate validated={validated} onSubmit={handleSubmit}>
        <CCol md={6} className="mb-3">
          <CFormInput
            type="text"
            floatingLabel="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormInput
            type="text"
            floatingLabel="Job Type"
            value={job_type}
            onChange={(e) => setJobType(e.target.value)}
            required
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormInput
            type="text"
            floatingLabel="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormInput
            type="text"
            floatingLabel="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </CCol>
        <CCol md={6} className="mb-3">
          <CFormInput
            type="text"
            floatingLabel="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </CCol>
        <CCol md={12} className="mb-3">
          <CFormTextarea
            type="text"
            floatingLabel="Description"
            style={{ height: '6em' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </CCol>
        <CCol md={12} className="mb-3">
          <CFormTextarea
            type="text"
            floatingLabel="Demand"
            style={{ height: '8em' }}
            value={demand}
            onChange={(e) => setDemand(e.target.value)}
            required
          />
        </CCol>
        <div className="mb-3">
          <CButton type="submit" color="primary">
            Submit
          </CButton>
        </div>
      </CForm>
    </>
  )
}

export default NewJobPosting
