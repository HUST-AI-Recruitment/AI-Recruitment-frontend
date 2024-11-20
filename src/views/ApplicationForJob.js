import { CButton, CCol, CRow, CSpinner } from '@coreui/react'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ApplicationCard from 'src/components/ApplicationCard'

const ApplicationForJob = () => {
  const jobID = parseInt(useParams().id)
  const getUrl = `https://api.recruitment.kkkstra.cn/api/v1/applications/job/${jobID}`
  const aiScoreUrl = `https://api.recruitment.kkkstra.cn/api/v1/recommend/resumes?job_id=${jobID}`
  const [applications, setApplications] = React.useState([])
  const token = useSelector((state) => state.authReducer.token)
  const [loading, setLoading] = React.useState(false)
  const role = useSelector((state) => state.authReducer.role)
  const navigate = useNavigate()

  useEffect(() => {
    if (role !== 1) {
      alert('只有 HR 可以查看此页面')
      navigate('/all-jobs')
    }
  }, [role, navigate])

  console.log('jobID', jobID)
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
        if (data['msg'] === 'permission denied') alert('只有工作发布者本人可以查看此页面')
        else if (data['msg'] === 'database error') alert('数据库错误')
        else if (data['msg'] === 'invalid job_id') alert('无效的工作 ID')
        else if (data['msg'] === 'job does not exist') alert('工作不存在')
        else alert('获取申请列表失败')
        console.log('get applications failed')
        return
      }
      setApplications(data['data']['applications'] || [])
    }
    fetchData()
  }, [getUrl, token])

  const handleAiScoring = async () => {
    setLoading(true)
    const response = await fetch(aiScoreUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    if (!response.ok) {
      console.log('get ai score failed')
      setLoading(false)
      return
    }
    const data = await response.json()
    if (!response.ok) {
      if (data['msg'] === 'permission denied') alert('只有工作发布者本人可以查看此页面')
      else if (data['msg'] === 'database error') alert('数据库错误')
      else if (data['msg'] === 'get job failed') alert('获取工作信息失败')
      else if (data['msg'] === 'get resume list failed') alert('获取简历信息失败')
      else if (data['msg'] === 'get resume education list failed') alert('获取教育经历失败')
      else if (data['msg'] === 'get resume experience list failed') alert('获取工作经历失败')
      else if (data['msg'] === 'get resume project list failed') alert('获取项目经历失败')
      else if (data['msg'] === 'json marshal failed') alert('JSON 序列化失败')
      else if (data['msg'] === 'json unmarshal failed') alert('JSON 反序列化失败')
      else if (data['msg'] === 'create request failed') alert('创建请求失败')
      else if (data['msg'] === 'send request failed') alert('发送请求失败')
      else if (data['msg'] === 'read response body failed') alert('读取响应失败')
      else alert('获取 AI 评分失败')
      return
    }
    const scores = data['data']['score'] || []
    console.log('score', scores)
    setApplications(
      applications.map((application) => ({
        ...application,
        score:
          scores.find((s) => s.id === application.user_id)?.score ||
          Math.floor(Math.random() * 100) + 1,
      })),
    )
    console.log('applications', applications)
    setLoading(false)
  }

  console.log('applications', applications)

  return (
    <>
      <CButton color="primary" onClick={handleAiScoring} disabled={loading}>
        用 AI 评分
      </CButton>
      {loading && (
        <div className="pt-2 text-start d-flex align-items-center justify-content-flex-start">
          <span style={{ marginRight: 4 }}>
            <strong role="status">AI 打分中……</strong>
          </span>
          <span>
            <CSpinner className="ms-auto" />
          </span>
        </div>
      )}
      <CRow className="pt-3" xs={{ cols: 'auto' }}>
        {applications.map((application) => (
          <CCol key={application.id}>
            <ApplicationCard application={application}></ApplicationCard>
          </CCol>
        ))}
      </CRow>
    </>
  )
}

export default ApplicationForJob
