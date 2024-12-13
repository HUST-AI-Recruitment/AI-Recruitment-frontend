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
      const data = await response.json()
      if (!response.ok) {
        if (data['msg'] === 'invalid id') alert('无效的工作 ID')
        else if (data['msg'] === 'get job failed') alert('获取工作信息失败')
        else alert('获取工作信息失败')
        console.log('获取工作信息失败')
        return
      }
      setJob(data['data']['job'])
    }
    if (id) fetchData()
  }, [getUrl, token, id])

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
      alert('成功删除工作')
      navigate('/all-jobs')
    } else {
      const data = await response.json()
      console.log(data)
      if (data['msg'] === 'invalid id') alert('无效的工作 ID')
      else if (data['msg'] === 'delete job failed') alert('删除工作失败')
      else if (data['msg'] === 'permission denied') alert('只有发布者本人可以删除工作')
      else if (data['msg'] === 'get job failed') alert('获取工作信息失败')
      else if (data['msg'] === 'delete job related applications failed')
        alert('删除该工作相关申请失败')
      else alert('删除工作失败')
    }
  }

  const applyUrl = `https://api.recruitment.kkkstra.cn/api/v1/applications`
  const handleApply = async () => {
    console.log('apply job')
    const response = await fetch(applyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        job_id: parseInt(id),
      }),
    })
    if (response.ok) {
      alert('工作申请成功')
      navigate('/all-jobs')
    } else {
      const data = await response.json()
      console.log(data)
      if (data['msg'] === 'resume does not exist') {
        alert('简历不存在，请先创建简历')
        navigate(`/resume/${userid}`)
      } else if (data['msg'] === 'application already exists') {
        alert('您已经申请过该工作了')
      } else if (data['msg'] === 'database error') alert('数据库错误')
      else if (data['msg'] === 'permission denied') alert('只有求职者可以申请工作')
      else if (data['msg'] === 'create application failed') alert('工作申请失败')
      else if (data['msg'] === 'invalid params') alert('无效的参数')
      else if (data['msg'] === 'job does not exist') alert('工作不存在')
      else alert('工作申请失败')
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
        <CCardText as={'div'} className="pb-3">
          <strong>职位描述：</strong>
          {job.description.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </CCardText>
        <CCardText as={'div'} className="pb-3">
          <strong>职位要求：</strong>
          {job.demand.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </CCardText>
      </CCardBody>
      {role === 1 && job.owner_id === userid && (
        <CCardFooter>
          <span>
            <CButton color="primary" onClick={handleEdit} className="text-white">
              <CIcon icon={cilPencil} /> 编辑
            </CButton>
            <span> </span>
            <CButton color="danger" onClick={handleDelete} className="text-white">
              <CIcon icon={cilTrash} /> 删除
            </CButton>
            <span> </span>
            <CButton
              color="info"
              onClick={() => {
                navigate(`/application/job/${id}`)
              }}
              className="text-white"
            >
              查看申请
            </CButton>
          </span>
        </CCardFooter>
      )}
      {role === 2 && (
        <CCardFooter>
          <CButton color="primary" onClick={handleApply}>
            申请职位
          </CButton>
        </CCardFooter>
      )}
    </CCard>
  )
}

export { useJob }
export default JobDetail
