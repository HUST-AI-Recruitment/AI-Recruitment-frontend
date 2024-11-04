import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { CButton, CCard, CCardBody, CCardText, CCardTitle, CSpinner } from '@coreui/react'

const useJob = (id) => {
  const [job, setJob] = React.useState(null)
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

  if (!job) {
    return (
      <div className="d-flex align-items-center">
        <strong role="status">Loading...</strong>
        <CSpinner className="ms-auto" />
      </div>
    )
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
        <CCardText>
          <strong>职位描述：</strong>
          {job.description.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </CCardText>
        <CCardText>
          <strong>职位要求：</strong>
          {job.demand.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </CCardText>
        <CButton color="primary" href="#">
          Apply Now
        </CButton>
      </CCardBody>
    </CCard>
  )
}

export default JobDetail
