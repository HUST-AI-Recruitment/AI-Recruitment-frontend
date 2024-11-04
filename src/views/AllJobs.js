import React from 'react'
import { CCard, CCardBody, CCardTitle, CCardText, CButton, CCol, CRow } from '@coreui/react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AllJobs = () => {
  const [jobs, setJobs] = React.useState([])
  const getUrl = 'https://api.recruitment.kkkstra.cn/api/v1/jobs'
  const token = useSelector((state) => state.authReducer.token)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(getUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      if (!response.ok) {
        console.log('get all jobs failed')
        return
      }
      const data = await response.json()
      setJobs(data['data']['jobs'])
    }
    fetchData()
  }, [getUrl, token])

  const handleClick = (jobId) => (event) => {
    event.preventDefault()
    console.log('jobId', jobId)
    navigate(`/job/${jobId}`)
  }

  console.log('jobs', jobs)
  return (
    <>
      <CRow>
        {jobs.map((job, index) => (
          <CCol sm={3} key={index}>
            <CCard key={job.id} style={{ width: '18rem', marginBottom: '1rem' }}>
              <CCardBody>
                <CCardTitle>{job.title}</CCardTitle>
                <CCardText>地址：{job.location}</CCardText>
                <CCardText>薪水：{job.salary}</CCardText>
                <CCardText>公司名：{job.company}</CCardText>
                <CButton color="primary" href="#" onClick={handleClick(job.id)}>
                  查看详情
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </>
  )
}

export default AllJobs