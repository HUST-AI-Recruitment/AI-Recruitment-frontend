import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ApplicationCard from 'src/components/ApplicationCard'
import { CCol, CRow } from '@coreui/react'

const MyApplication = () => {
  const [myApplications, setMyApplications] = React.useState([])
  const token = useSelector((state) => state.authReducer.token)
  const getUrl = 'https://api.recruitment.kkkstra.cn/api/v1/applications'

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
      setMyApplications(data['data']['applications'])
    }
    fetchData()
  }, [getUrl, token])

  return (
    <CRow>
      {myApplications.map((application) => (
        <CCol sm={3} key={application.id}>
          <ApplicationCard application={application}></ApplicationCard>
        </CCol>
      ))}
    </CRow>
  )
}

export default MyApplication
