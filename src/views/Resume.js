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
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilPlaylistAdd, cilTrash } from '@coreui/icons'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const Resume = () => {
  const id = parseInt(useParams().id)
  const userid = useSelector((state) => state.authReducer.userid)
  const token = useSelector((state) => state.authReducer.token)
  const getUrl = `https://api.recruitment.kkkstra.cn/api/v1/resumes/${id}`
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
  const disabled = userid !== id

  const key2Label = {
    school: '学校',
    major: '专业',
    degree: '学位',
    start_time: '开始时间',
    end_time: '毕业时间',
    company: '公司',
    position: '地点',
    name: '名称',
    description: '描述',
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
      method: isGet ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      isGet ? alert('简历创建成功') : alert('简历更新成功')
    } else {
      isGet ? alert('简历创建失败') : alert('简历更新失败')
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
      {!disabled && (
        <CAlert color="info" dismissible>
          如果在此页面有任何修改，请及时保存
        </CAlert>
      )}
      <CForm className="row g-3" noValidate validated={validated} onSubmit={handleSubmit}>
        <CCol md={6}>
          <CFormInput
            feedbackInvalid="请填写您的名字"
            type="text"
            label="姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={disabled}
            style={{ backgroundColor: 'white' }}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormSelect
            feedbackInvalid="请选择性别"
            label="性别"
            value={gender}
            onChange={(e) => {
              if (e.target.value === '') setGender(0)
              else setGender(parseInt(e.target.value))
              e.target.blur()
            }}
            disabled={disabled}
            style={{ backgroundColor: 'white' }}
            required
          >
            <option value="">请选择性别</option>
            <option value={1}>男</option>
            <option value={2}>女</option>
          </CFormSelect>
        </CCol>
        <CCol md={6}>
          <CFormInput
            feedbackInvalid="请填写手机号"
            type="text"
            label="手机号"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={disabled}
            style={{ backgroundColor: 'white' }}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            feedbackInvalid="请填写邮箱"
            type="email"
            label="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
            style={{ backgroundColor: 'white' }}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            feedbackInvalid="请填写您的微信联系方式"
            type="text"
            label="微信联系方式"
            value={wechat}
            onChange={(e) => setWechat(e.target.value)}
            disabled={disabled}
            style={{ backgroundColor: 'white' }}
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormSelect
            feedbackInvalid="请选择求职状态"
            label="求职状态"
            value={state}
            onChange={(e) => {
              if (e.target.value === '') setState(0)
              else setState(parseInt(e.target.value))
              e.target.blur()
            }}
            disabled={disabled}
            style={{ backgroundColor: 'white' }}
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
            feedbackInvalid="请添加备注"
            type="text"
            label="其他"
            style={{ height: '6em', backgroundColor: 'white' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={disabled}
            required
          />
        </CCol>
        <h5>教育经历</h5>
        {!disabled && (
          <CCol md={12}>
            <CButton color="info" onClick={handleAddEducation} className="text-white">
              <CIcon icon={cilPlaylistAdd} /> 添加教育经历
            </CButton>
          </CCol>
        )}
        <CCol md={12}>
          <CListGroup>
            {educations.map((edu, index) => (
              <CListGroupItem key={index}>
                <CRow className="d-flex align-items-center">
                  <CCol md={4} className="my-1">
                    <strong>学校：</strong> {edu.school}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>专业：</strong> {edu.major}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>学位：</strong> {['学士', '硕士', '博士'][edu.degree - 1]}
                  </CCol>
                  <CCol md={4}>
                    <strong>开始时间：</strong> {new Date(edu.start_time).toLocaleDateString()}
                  </CCol>
                  <CCol md={4}>
                    <strong>结束时间：</strong> {new Date(edu.end_time).toLocaleDateString()}
                  </CCol>
                  {!disabled && (
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
                  )}
                </CRow>
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCol>
        <h5>工作经历</h5>
        {!disabled && (
          <CCol md={12}>
            <CButton color="info" className="text-white" onClick={handleAddExperience}>
              <CIcon icon={cilPlaylistAdd} /> 添加工作经历
            </CButton>
          </CCol>
        )}
        <CCol md={12}>
          <CListGroup>
            {experiences.map((exp, index) => (
              <CListGroupItem key={index}>
                <CRow className="d-flex align-items-center">
                  <CCol md={4} className="my-1">
                    <strong>公司名称：</strong> {exp.company}
                  </CCol>
                  <CCol md={8} className="my-1">
                    <strong>职位：</strong> {exp.position}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>开始时间：</strong> {new Date(exp.start_time).toLocaleDateString()}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>结束时间：</strong> {new Date(exp.end_time).toLocaleDateString()}
                  </CCol>
                  {!disabled && (
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
                  )}
                </CRow>
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCol>
        <h5>项目经历</h5>
        {!disabled && (
          <CCol md={12}>
            <CButton color="info" className="text-white" onClick={handleAddProject}>
              <CIcon icon={cilPlaylistAdd} /> 添加项目经历
            </CButton>
          </CCol>
        )}
        <CCol md={12}>
          <CListGroup>
            {projects.map((project, index) => (
              <CListGroupItem key={index}>
                <CRow className="d-flex align-items-center">
                  <CCol md={4} className="my-1">
                    <strong>项目名称：</strong> {project.name}
                  </CCol>
                  <CCol md={8} className="my-1">
                    <strong>项目描述：</strong> {project.description}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>开始时间：</strong> {new Date(project.start_time).toLocaleDateString()}
                  </CCol>
                  <CCol md={4} className="my-1">
                    <strong>结束时间：</strong> {new Date(project.end_time).toLocaleDateString()}
                  </CCol>
                  {!disabled && (
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
                  )}
                </CRow>
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCol>
        {!disabled && (
          <div className="mt-3">
            <CButton type="submit" color="primary">
              提交保存
            </CButton>
          </div>
        )}
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
                    feedbackInvalid={`请填写${key2Label[key]}`}
                    label={key2Label[key]}
                    value={key === 'start_time' || key === 'end_time' ? value.slice(0, 10) : value}
                    min={key === 'end_time' ? modalData['start_time'].slice(0, 10) : ''}
                    onChange={(e) => setModalData({ ...modalData, [key]: e.target.value })}
                    required
                  />
                ) : (
                  <CFormSelect
                    feedbackInvalid="请选择教育经历"
                    label={key2Label[key]}
                    value={value}
                    onChange={(e) => {
                      if (e.target.value === '') setModalData({ ...modalData, [key]: 0 })
                      else setModalData({ ...modalData, [key]: parseInt(e.target.value) })
                      e.target.blur()
                    }}
                    required
                  >
                    <option value="">选择学位</option>
                    <option value={1}>学士</option>
                    <option value={2}>硕士</option>
                    <option value={3}>博士</option>
                  </CFormSelect>
                )}
              </CCol>
            ))}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" form="modal-form" type="submit">
            保存
          </CButton>
          <CButton color="secondary" onClick={() => setIsModalOpen(false)}>
            取消
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Resume
