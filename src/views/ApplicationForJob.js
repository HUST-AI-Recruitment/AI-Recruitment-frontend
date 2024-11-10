import { CCol, CFormCheck, CRow, CSpinner } from '@coreui/react'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ApplicationCard from 'src/components/ApplicationCard'

const ApplicationForJob = () => {
  const jobID = parseInt(useParams().id)
  const getUrl = `https://api.recruitment.kkkstra.cn/api/v1/applications/job/${jobID}`
  const aiScoreUrl = `https://api.recruitment.kkkstra.cn/api/v1/recommend/resumes?job_id=${jobID}`
  const [applications, setApplications] = React.useState([])
  const token = useSelector((state) => state.authReducer.token)
  const [aiScore, setAiScore] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  console.log('jobID', jobID)
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(getUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      if (!response.ok) {
        console.log('get applications failed')
        return
      }
      const data = await response.json()
      setApplications(data['data']['applications'])
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
      return
    }
    const data = await response.json()
    const scores = data['data']['score']
    console.log('score', scores)
    setApplications(
      applications.map((application) => ({
        ...application,
        score: scores.find((s) => s.id === application.id)?.score || null,
      })),
    )
    console.log('applications', applications)
    setLoading(false)
  }

  console.log('applications', applications)

  return (
    <>
      <CFormCheck
        type="checkbox"
        label="使用 AI 评分"
        checked={aiScore}
        onChange={(e) => {
          setAiScore(e.target.checked)
          if (e.target.checked) {
            handleAiScoring()
          }
        }}
        disabled={loading}
      />
      {loading && (
        <div className="pt-2 text-start">
          <strong role="status">Loading... </strong>
          <CSpinner className="ms-auto" />
        </div>
      )}
      <CRow className="pt-3">
        {applications.map((application) => (
          <CCol sm={3} key={application.id}>
            <ApplicationCard application={application}></ApplicationCard>
          </CCol>
        ))}
      </CRow>
    </>
  )
}

export default ApplicationForJob
