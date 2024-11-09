import { CCol, CRow } from '@coreui/react'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ApplicationCard from 'src/components/ApplicationCard'

const ApplicationForJob = () => {
  const jobID = parseInt(useParams().id)
  const getUrl = `https://api.recruitment.kkkstra.cn/api/v1/applications/job/${jobID}`
  const [applications, setApplications] = React.useState([])
  const token = useSelector((state) => state.authReducer.token)
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

  return (
    <CRow>
      {applications.map((application) => (
        <CCol sm={3} key={application.id}>
          <ApplicationCard application={application}></ApplicationCard>
        </CCol>
      ))}
    </CRow>
  )
}

export default ApplicationForJob
