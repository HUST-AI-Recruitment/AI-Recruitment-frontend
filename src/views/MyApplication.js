import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ApplicationCard from 'src/components/ApplicationCard'
import { CCol, CRow } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const MyApplication = () => {
  const [myApplications, setMyApplications] = React.useState([])
  const token = useSelector((state) => state.authReducer.token)
  const getUrl = 'https://api.recruitment.kkkstra.cn/api/v1/applications'
  const role = useSelector((state) => state.authReducer.role)
  const navigate = useNavigate()

  useEffect(() => {
    if (role !== 2) {
      alert('只有应聘者可以查看此页面')
      navigate('/all-jobs')
    }
  }, [role, navigate])

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
      setMyApplications(data['data']['applications'] || [])
    }
    fetchData()
  }, [getUrl, token])

  return (
    <CRow xs={{ cols: 'auto' }}>
      {myApplications.map((application) => (
        <CCol key={application.id}>
          <ApplicationCard application={application}></ApplicationCard>
        </CCol>
      ))}
    </CRow>
  )
}

export default MyApplication
