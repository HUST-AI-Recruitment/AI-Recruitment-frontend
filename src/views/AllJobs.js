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
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const AllJobs = () => {
  const [jobs, setJobs] = React.useState([])
  const [allJobs, setAllJobs] = React.useState([])
  const own = useSelector((state) => state.changeState.seeMyOwnJobs)
  const getUrl = 'https://api.recruitment.kkkstra.cn/api/v1/jobs?own=' + own
  const recommendUrl = 'https://api.recruitment.kkkstra.cn/api/v1/recommend/jobs'
  const token = useSelector((state) => state.authReducer.token)
  const role = useSelector((state) => state.authReducer.role)
  const navigate = useNavigate()
  const [recommendBy, setRecommendBy] = React.useState(0)
  const [searchText, setSearchText] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const userid = useSelector((state) => state.authReducer.userid)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(getUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      const data = await response.json()
      if (!response.ok) {
        if (data['msg'] === 'permission denied') alert('只有招聘者可以选择“只看我创建的”选项')
        else if (data['msg'] === 'get all jobs failed') alert('获取工作列表失败')
        else alert('获取工作列表失败')
        console.log('get all jobs failed')
        return
      }
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

  const handleRecommendSubmit = async (type) => {
    setLoading(true)
    const response = await fetch(recommendUrl, {
      method: type === 2 ? 'POST' : 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: type === 2 ? JSON.stringify({ description: searchText }) : null,
    })
    const data = await response.json()
    if (!response.ok) {
      setLoading(false)
      if (data['msg'] === 'get resume list failed') {
        alert('请先填写简历')
        navigate(`/resume/${userid}`)
      } else if (data['msg'] === 'get resume education list failed') alert('获取教育经历失败')
      else if (data['msg'] === 'get resume experience list failed') alert('获取工作经历失败')
      else if (data['msg'] === 'get resume project list failed') alert('获取项目经历失败')
      else if (data['msg'] === 'get all jobs failed') alert('获取工作列表失败')
      else if (data['msg'] === 'json marshal failed') alert('JSON 序列化失败')
      else if (data['msg'] === 'json unmarshal failed') alert('JSON 反序列化失败')
      else if (data['msg'] === 'create request failed') alert('创建请求失败')
      else if (data['msg'] === 'send request failed') alert('发送请求失败')
      else if (data['msg'] === 'read response body failed') alert('读取响应失败')
      else if (data['msg'] === 'invalid param') alert('参数无效')
      else if (data['msg'] === 'permission denied') alert('只有求职者可以选择 AI 推荐')
      else alert('获取 AI 推荐失败')
      return
    } else {
      const jobIds = data['data']['jobs'] || []
      const recommendJobs = jobIds.map((jobId) => allJobs.find((job) => job.id === jobId))
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
          label="只看我创建的"
          checked={own}
          onChange={(e) => dispatch({ type: 'setSeeMyOwnJobs', seeMyOwnJobs: e.target.checked })}
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
              handleRecommendSubmit(1)
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
                handleRecommendSubmit(2)
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
        <div className="pt-2 text-start d-flex align-items-center justify-content-flex-start">
          <span style={{ marginRight: 4 }}>
            <strong role="status">AI 推荐中……</strong>
          </span>
          <span>
            <CSpinner className="ms-auto" />
          </span>
        </div>
      )}
      <CRow className="pt-3" xs={{ cols: 'auto' }}>
        {jobs.map((job, index) => (
          <CCol key={index}>
            <CCard key={job.id} style={{ marginBottom: '1rem', minWidth: '16rem' }}>
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
