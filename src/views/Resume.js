import React, { useEffect } from 'react'
import {
  CButton,
  CCol,
  CForm,
  CFormSelect,
  CFormInput,
  CFormTextarea,
  CListGroup,
  CListGroupItem,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilPlaylistAdd, cilTrash } from '@coreui/icons'
import { useSelector } from 'react-redux'

const Resume = () => {
  const userid = useSelector((state) => state.authReducer.userid)
  const token = useSelector((state) => state.authReducer.token)
  const getUrl = `https://api.recruitment.kkkstra.cn/api/v1/resumes/${userid}`
  const postUrl = `https://api.recruitment.kkkstra.cn/api/v1/resumes`
  const [validated, setValidated] = React.useState(false)
  const [name, setName] = React.useState('')
  const [gender, setGender] = React.useState(0)
  const [phone, setPhone] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [wechat, setWechat] = React.useState('')
  const [state, setState] = React.useState(0)
  const [description, setDescription] = React.useState('')
  const [educations, setEducations] = React.useState([])
  const [experiences, setExperiences] = React.useState([])
  const [projects, setProjects] = React.useState([])
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalType, setModalType] = React.useState('')
  const [modalData, setModalData] = React.useState({})
  const [index, setIndex] = React.useState(-1)
  const [isGet, setIsGet] = React.useState(false)

  const key2Label = {
    school: 'School',
    major: 'Major',
    degree: 'Degree',
    start_time: 'Start Time',
    end_time: 'End Time',
    company: 'Company',
    position: 'Position',
    name: 'Name',
    description: 'Description',
  }

  console.log('Gender', gender)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(getUrl, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      if (response.ok) {
        const data = await response.json()
        const resume = data['data']['resume']
        console.log('data', data)
        console.log('resume', resume)
        setName(resume.name)
        setGender(resume.gender)
        setPhone(resume.phone)
        setEmail(resume.email)
        setWechat(resume.wechat)
        setState(resume.state)
        setDescription(resume.description)
        setEducations(resume.education || [])
        setExperiences(resume.experience || [])
        setProjects(resume.project || [])
        setIsGet(true)
      }
    }
    fetchData()
  }, [getUrl, token])

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
      return
    }
    const data = {
      name: name,
      gender: gender,
      phone: phone,
      email: email,
      wechat: wechat,
      state: state,
      description: description,
      education: educations.map((edu) => ({
        school: edu.school,
        major: edu.major,
        degree: edu.degree,
        start_time: new Date(edu.start_time).toISOString(),
        end_time: new Date(edu.end_time).toISOString(),
      })),
      experience: experiences.map((exp) => ({
        company: exp.company,
        position: exp.position,
        start_time: new Date(exp.start_time).toISOString(),
        end_time: new Date(exp.end_time).toISOString(),
      })),
      project: projects.map((project) => ({
        name: project.name,
        description: project.description,
        start_time: new Date(project.start_time).toISOString(),
        end_time: new Date(project.end_time).toISOString(),
      })),
    }
    const response = await fetch(postUrl, {
      method: isGet? 'PUT': 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      isGet? alert('Resume created successfully') : alert('Resume updated successfully')
    } else {
      isGet? alert('Resume creation failed') : alert('Resume update failed')
    }
  }

  const handleAddEducation = () => {
    setIsModalOpen(true)
    setModalType('添加教育经历')
    setModalData({
      school: '',
      major: '',
      degree: 0,
      start_time: '',
      end_time: '',
    })
  }

  const handleAddExperience = () => {
    setIsModalOpen(true)
    setModalType('添加工作经历')
    setModalData({
      company: '',
      position: '',
      start_time: '',
      end_time: '',
    })
  }

  const handleAddProject = () => {
    setIsModalOpen(true)
    setModalType('添加项目经历')
    setModalData({
      name: '',
      description: '',
      start_time: '',
      end_time: '',
    })
  }

  const handleEditModalData = (data, index) => {
    setIsModalOpen(true)
    setModalData(data)
    setIndex(index)
  }

  const handleEditEducation = (edu, index) => () => {
    handleEditModalData(edu, index)
    setModalType('编辑教育经历')
  }

  const handleEditExperience = (exp, index) => () => {
    handleEditModalData(exp, index)
    setModalType('编辑工作经历')
  }

  const handleEditProject = (project, index) => () => {
    handleEditModalData(project, index)
    setModalType('编辑项目经历')
  }

  const handleModalSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.stopPropagation()
      return
    }
    switch (modalType) {
      case '添加教育经历': {
        const newEducations = [...educations, modalData]
        setEducations(newEducations.sort((a, b) => new Date(b.start_time) - new Date(a.start_time)))
        break
      }
      case '编辑教育经历': {
        const newEducations = [...educations]
        newEducations[index] = modalData
        setEducations(newEducations.sort((a, b) => new Date(b.start_time) - new Date(a.start_time)))
        break
      }
      case '添加工作经历': {
        const newExperiences = [...experiences, modalData]
        setExperiences(
          newExperiences.sort((a, b) => new Date(b.start_time) - new Date(a.start_time)),
        )
        break
      }
      case '编辑工作经历': {
        const newExperiences = [...experiences]
        newExperiences[index] = modalData
        setExperiences(
          newExperiences.sort((a, b) => new Date(b.start_time) - new Date(a.start_time)),
        )
        break
      }
      case '添加项目经历': {
        const newProjects = [...projects, modalData]
        setProjects(newProjects.sort((a, b) => new Date(b.start_time) - new Date(a.start_time)))
        break
      }
      case '编辑项目经历': {
        const newProjects = [...projects]
        newProjects[index] = modalData
        setProjects(newProjects.sort((a, b) => new Date(b.start_time) - new Date(a.start_time)))
        break
      }
      default:
        break
    }
    setIsModalOpen(false)
  }

  console.log('isModalOpen', isModalOpen)
  console.log('modalType', modalType)
  console.log('modalData', modalData)

  console.log('educations', educations)

  console.log('gender', gender)

  return (
    <>
      <CForm className="row g-3" noValidate validated={validated} onSubmit={handleSubmit}>
        <CCol md={6}>
          <CFormInput
            type="text"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormSelect
            feedbackInvalid="Please select gender."
            label="Gender"
            value={gender}
            onChange={(e) => {
              if (e.target.value === '') setGender(0)
              else setGender(parseInt(e.target.value))
              e.target.blur()
            }}
            required
          >
            <option value="">Select Gender</option>
            <option value={1}>男</option>
            <option value={2}>女</option>
          </CFormSelect>
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="text"
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="text"
            label="Wechat"
            value={wechat}
            onChange={(e) => setWechat(e.target.value)}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormSelect
            feedbackInvalid="请选择求职状态"
            label="State"
            value={state}
            onChange={(e) => {
              if (e.target.value === '') setState(0)
              else setState(parseInt(e.target.value))
              e.target.blur()
            }}
            required
          >
            <option value="">请选择求职状态</option>
            <option value={1}>毕业-随时到岗</option>
            <option value={2}>在校-暂不考虑</option>
            <option value={3}>在校-考虑机会</option>
            <option value={4}>在校-可以到岗</option>
          </CFormSelect>
        </CCol>
        <CCol md={12}>
          <CFormTextarea
            type="text"
            label="Description"
            style={{ height: '6em' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </CCol>
        <h5>Education</h5>
        <CCol md={12}>
          <CButton color="info" onClick={handleAddEducation} className="text-white">
            <CIcon icon={cilPlaylistAdd} /> 添加教育经历
          </CButton>
        </CCol>
        <CCol md={12}>
          <CListGroup>
            {educations.map((edu, index) => (
              <CListGroupItem key={index}>
                <CRow className="d-flex align-items-center">
                  <CCol md={4} className="my-1">
                    <strong>School:</strong> {edu.school}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>Major:</strong> {edu.major}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>Degree:</strong> {['Bachelor', 'Master', 'PhD'][edu.degree - 1]}
                  </CCol>
                  <CCol md={4}>
                    <strong>Start Time:</strong> {new Date(edu.start_time).toLocaleDateString()}
                  </CCol>
                  <CCol md={4}>
                    <strong>End Time:</strong> {new Date(edu.end_time).toLocaleDateString()}
                  </CCol>
                  <CCol md={4} className="text-end">
                    <CButton
                      className="me-2 text-white"
                      color="info"
                      onClick={handleEditEducation(edu, index)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger text-white"
                      onClick={() => {
                        setEducations(educations.filter((_, i) => i !== index))
                      }}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCol>
        <h5>Experience</h5>
        <CCol md={12}>
          <CButton color="info" className="text-white" onClick={handleAddExperience}>
            <CIcon icon={cilPlaylistAdd} /> 添加工作经历
          </CButton>
        </CCol>
        <CCol md={12}>
          <CListGroup>
            {experiences.map((exp, index) => (
              <CListGroupItem key={index}>
                <CRow className="d-flex align-items-center">
                  <CCol md={4} className="my-1">
                    <strong>Company:</strong> {exp.company}
                  </CCol>
                  <CCol md={8} className="my-1">
                    <strong>Position:</strong> {exp.position}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>Start Time:</strong> {new Date(exp.start_time).toLocaleDateString()}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>End Time:</strong> {new Date(exp.end_time).toLocaleDateString()}
                  </CCol>
                  <CCol md={4} className="text-end">
                    <CButton
                      className="me-2 text-white"
                      color="info"
                      onClick={handleEditExperience(exp, index)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger text-white"
                      onClick={() => {
                        setExperiences(experiences.filter((_, i) => i !== index))
                      }}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCol>
        <h5>Project</h5>
        <CCol md={12}>
          <CButton color="info" className="text-white" onClick={handleAddProject}>
            <CIcon icon={cilPlaylistAdd} /> 添加项目经历
          </CButton>
        </CCol>
        <CCol md={12}>
          <CListGroup>
            {projects.map((project, index) => (
              <CListGroupItem key={index}>
                <CRow className="d-flex align-items-center">
                  <CCol md={4} className="my-1">
                    <strong>Name:</strong> {project.name}
                  </CCol>
                  <CCol md={8} className="my-1">
                    <strong>Description:</strong> {project.description}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>Start Time:</strong> {new Date(project.start_time).toLocaleDateString()}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>End Time:</strong> {new Date(project.end_time).toLocaleDateString()}
                  </CCol>
                  <CCol md={4} className="text-end">
                    <CButton
                      className="me-2 text-white"
                      color="info"
                      onClick={handleEditProject(project, index)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger text-white"
                      onClick={() => {
                        setProjects(projects.filter((_, i) => i !== index))
                      }}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CCol>
                </CRow>
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCol>
        <div className="mt-3">
          <CButton type="submit" color="primary">
            Submit
          </CButton>
        </div>
      </CForm>
      <CModal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>{modalType}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate validated={true} id="modal-form" onSubmit={handleModalSubmit}>
            {Object.entries(modalData).map(([key, value]) => (
              <CCol md={6} key={key} className="mb-3">
                {key !== 'degree' ? (
                  <CFormInput
                    type={key === 'start_time' || key === 'end_time' ? 'date' : 'text'}
                    label={key2Label[key]}
                    value={key === 'start_time' || key === 'end_time' ? value.slice(0, 10) : value}
                    onChange={(e) => setModalData({ ...modalData, [key]: e.target.value })}
                    required
                  />
                ) : (
                  <CFormSelect
                    feedbackInvalid="Please select degree."
                    label={key2Label[key]}
                    value={value}
                    onChange={(e) => {
                      if (e.target.value === '') setModalData({ ...modalData, [key]: 0 })
                      else setModalData({ ...modalData, [key]: parseInt(e.target.value) })
                      e.target.blur()
                    }}
                    required
                  >
                    <option value="">Select Degree</option>
                    <option value={1}>Bachelor</option>
                    <option value={2}>Master</option>
                    <option value={3}>PhD</option>
                  </CFormSelect>
                )}
              </CCol>
            ))}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" form="modal-form" type="submit">
            Save
          </CButton>
          <CButton color="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Resume
