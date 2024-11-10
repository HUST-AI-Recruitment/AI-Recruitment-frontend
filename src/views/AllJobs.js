import React from 'react'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CCol,
  CRow,
  CFormCheck,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CForm,
  CSpinner,
} from '@coreui/react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const AllJobs = () => {
  const [jobs, setJobs] = React.useState([])
  const [allJobs, setAllJobs] = React.useState([])
  const [own, setOwn] = React.useState(false)
  const getUrl = 'https://api.recruitment.kkkstra.cn/api/v1/jobs?own=' + own
  const recommendUrl = 'https://api.recruitment.kkkstra.cn/api/v1/recommend/jobs'
  const token = useSelector((state) => state.authReducer.token)
  const role = useSelector((state) => state.authReducer.role)
  const navigate = useNavigate()
  const [recommendBy, setRecommendBy] = React.useState(0)
  const [searchText, setSearchText] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const userid = useSelector((state) => state.authReducer.userid)

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
      setAllJobs(data['data']['jobs'] || [])
      setJobs(data['data']['jobs'] || [])
    }
    fetchData()
  }, [getUrl, token])

  const handleClick = (jobId) => (event) => {
    event.preventDefault()
    console.log('jobId', jobId)
    navigate(`/job/${jobId}`)
  }

  const handleRecommendSubmit = async () => {
    setLoading(true)
    console.log('recommendBy', recommendBy)
    const response = await fetch(recommendUrl, {
      method: recommendBy === 2 ? 'POST' : 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: recommendBy === 2 ? JSON.stringify({ description: searchText }) : null,
    })
    const data = await response.json()
    if (!response.ok) {
      setLoading(false)
      console.log('get recommend jobs failed')
      console.log('response', response)
      if (data['msg'] === 'get resume list failed') {
        alert('请先填写简历')
        navigate(`/resume/${userid}`)
      }
      return
    } else {
      console.log('data', data)
      console.log('data[data]', data['data'])
      console.log('data[data][jobs]', data['data']['jobs'])
      const jobIds = data['data']['jobs'] || []
      console.log('jobIds', jobIds)
      const recommendJobs = jobIds.map((jobId) => allJobs.find((job) => job.id === jobId))
      console.log('recommendJobs', recommendJobs)
      setJobs(recommendJobs)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (recommendBy === 0) {
      setJobs(allJobs)
    }
    setSearchText('')
  }, [recommendBy, allJobs])

  console.log('jobs', jobs)
  console.log('allJobs', allJobs)
  console.log('recommendBy', recommendBy)

  return (
    <>
      {role === 1 && (
        <CFormCheck
          type="checkbox"
          id="own"
          label="Only show my jobs"
          checked={own}
          onChange={(e) => setOwn(e.target.checked)}
        />
      )}
      {role === 2 && (
        <CCol>
          <CFormCheck
            type="radio"
            label="默认排序"
            value={0}
            checked={recommendBy === 0}
            onChange={(e) => setRecommendBy(parseInt(e.target.value))}
            inline
            disabled={loading}
          />
          <CFormCheck
            type="radio"
            label="依据简历 AI 推荐"
            value={1}
            checked={recommendBy === 1}
            onChange={(e) => {
              setRecommendBy(parseInt(e.target.value))
              setSearchText('')
              e.preventDefault()
              e.stopPropagation()
              handleRecommendSubmit()
            }}
            inline
            disabled={loading}
          />
          <CFormCheck
            type="radio"
            label="依据描述 AI 推荐"
            value={2}
            checked={recommendBy === 2}
            onChange={(e) => setRecommendBy(parseInt(e.target.value))}
            inline
            disabled={loading}
          />
          {recommendBy === 2 && (
            <CForm
              onSubmit={(e) => {
                e.preventDefault()
                handleRecommendSubmit()
              }}
            >
              <CInputGroup className="mt-2">
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="搜索"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  disabled={loading}
                />
              </CInputGroup>
            </CForm>
          )}
        </CCol>
      )}
      {loading && (
        <div className="pt-2 text-start">
          <strong role="status">Loading... </strong>
          <CSpinner className="ms-auto" />
        </div>
      )}
      <CRow className="pt-3" xs={{ cols: 'auto' }}>
        {jobs.map((job, index) => (
          <CCol key={index}>
            <CCard key={job.id} style={{ marginBottom: '1rem', minWidth: '14rem' }}>
              <CCardBody>
                <CCardTitle>{job.title}</CCardTitle>
                <CCardText as={'div'} style={{ marginBottom: '0.5rem' }}>
                  地址：{job.location}
                </CCardText>
                <CCardText as={'div'} style={{ marginBottom: '0.5rem' }}>
                  薪水：{job.salary}
                </CCardText>
                <CCardText as={'div'} style={{ marginBottom: '0.5rem' }}>
                  公司名：{job.company}
                </CCardText>
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
