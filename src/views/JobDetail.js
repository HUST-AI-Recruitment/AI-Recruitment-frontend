import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardText,
  CCardTitle,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import { setJob } from 'src/reducers/jobReducer'

const useJob = (id) => {
  const [job, setJob] = React.useState({
    id: 0,
    title: '',
    company: '',
    job_type: '',
    location: '',
    salary: '',
    description: '',
    demand: '',
    owner_id: 0,
  })
  const getUrl = `https://api.recruitment.kkkstra.cn/api/v1/jobs/${id}`
  const token = useSelector((state) => state.authReducer.token)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(getUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      if (!response.ok) {
        console.log('get job failed')
        return
      }
      const data = await response.json()
      setJob(data['data']['job'])
    }
    fetchData()
  }, [getUrl, token])

  return job
}

const JobDetail = () => {
  const { id } = useParams()
  const job = useJob(id)
  const role = useSelector((state) => state.authReducer.role)
  const userid = useSelector((state) => state.authReducer.userid)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state) => state.authReducer.token)

  if (job.id === 0) {
    return (
      <div className="d-flex align-items-center">
        <strong role="status">Loading...</strong>
        <CSpinner className="ms-auto" />
      </div>
    )
  }

  console.log('id', id)
  console.log('job', job)

  const handleEdit = () => {
    console.log('edit job')
    dispatch(setJob({ id: job.id, actionType: 'edit' }))
    navigate('/job-posting')
  }

  const deleteUrl = `https://api.recruitment.kkkstra.cn/api/v1/jobs/${id}`
  const handleDelete = async () => {
    console.log('delete job')
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    if (response.ok) {
      alert('Job posting deleted successfully')
      navigate('/all-jobs')
    }
  }

  return (
    <CCard style={{ width: '100%', marginBottom: '1rem' }}>
      <CCardBody>
        <CCardTitle className="h3 fw-bold pb-1">{job.title}</CCardTitle>
        <CCardText>
          <strong>公司名：</strong>
          {job.company}
        </CCardText>
        <CCardText>
          <strong>职位类型：</strong>
          {job.job_type}
        </CCardText>
        <CCardText>
          <strong>地址：</strong>
          {job.location}
        </CCardText>
        <CCardText>
          <strong>薪水：</strong>
          {job.salary}
        </CCardText>
        <CCardText as={'div'}>
          <strong>职位描述：</strong>
          {job.description.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </CCardText>
        <CCardText as={'div'}>
          <strong>职位要求：</strong>
          {job.demand.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </CCardText>
      </CCardBody>
      <CCardFooter>
        {role === 1 && job.owner_id === userid && (
          <span>
            <CButton color="primary" onClick={handleEdit}>
              <CIcon icon={cilPencil} />
              编辑
            </CButton>
            <span> </span>
            <CButton color="danger" onClick={handleDelete} className="text-white">
              <CIcon icon={cilTrash} />
              删除
            </CButton>
          </span>
        )}
      </CCardFooter>
    </CCard>
  )
}

export { useJob }
export default JobDetail
