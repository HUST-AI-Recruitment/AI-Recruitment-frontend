import { CButton, CCard, CCardBody, CCardText, CCardTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useJob } from 'src/views/JobDetail'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ApplicantCard = ({ job_id }) => {
  const job = useJob(job_id)
  return (
    <>
      <CCardTitle>{job.title}</CCardTitle>
      <CCardText as={'div'} style={{ marginBottom: '0.5rem' }}>
        薪水：{job.salary}
      </CCardText>
      <CCardText as={'div'} style={{ marginBottom: '0.5rem' }}>
        公司名：{job.company}
      </CCardText>
    </>
  )
}

const RecruiterCard = (props) => {
  const user_id = props.user_id
  const score = props.score
  const getUrl = `https://api.recruitment.kkkstra.cn/api/v1/resumes/${user_id}`
  const token = useSelector((state) => state.authReducer.token)
  const [resume, setResume] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(getUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      if (!response.ok) {
        console.log('get resume failed')
        return
      }
      const data = await response.json()
      setResume(data['data']['resume'])
    }
    fetchData()
  }, [getUrl, token])
  const state2Info = {
    1: '毕业-随时到岗',
    2: '在职-考虑机会',
    3: '在职-暂不考虑',
    4: '在校-可以到岗',
  }

  console.log('recruiter card score', score)

  return (
    <>
      <CCardTitle>{resume.name}</CCardTitle>
      <CCardText as={'div'} style={{ marginBottom: '0.5rem' }}>
        phone: {resume.phone}
      </CCardText>
      <CCardText as={'div'} style={{ marginBottom: '0.5rem' }}>
        email: {resume.email}
      </CCardText>
      <CCardText as={'div'} style={{ marginBottom: '0.5rem' }}>
        wechat: {resume.wechat}
      </CCardText>
      <CCardText as={'div'} style={{ marginBottom: '0.5rem' }}>
        status: {state2Info[resume.state]}
      </CCardText>
      {score !== undefined && (
        <CCardText as={'div'} style={{ marginBottom: '0.5rem' }}>
          AI 评分：{score}
        </CCardText>
      )}
    </>
  )
}

const ApplicationCard = ({ application }) => {
  const id = application.id
  const job_id = application.job_id
  const user_id = application.user_id
  const progress = application.progress
  const score = application.score
  const putUrl = `https://api.recruitment.kkkstra.cn/api/v1/applications/${id}`
  const role = useSelector((state) => state.authReducer.role)
  const navigate = useNavigate()
  const progress2Color = {
    1: 'rgba(255, 215, 0, 0.8)',
    2: 'rgba(173, 216, 230, 0.8)',
    3: 'rgba(50, 205, 50, 0.8)',
    4: 'rgba(255, 99, 71, 0.8)',
    5: 'rgba(70, 130, 180, 0.8)',
    6: 'rgba(169, 169, 169, 0.8)',
  }
  const progress2Info = {
    1: '已投递',
    2: '已接受申请',
    3: '公司已发出 offer',
    4: '公司拒绝发送 offer',
    5: '已接受 offer',
    6: '已拒绝 offer',
  }
  const buttonValid =
    (role === 1 && (progress === 1 || progress === 2)) || (role === 2 && progress === 3)

  const handleClick = (accepted) => async () => {
    const response = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        accepted: accepted,
      }),
    })
    if (!response.ok) {
      console.log('failed')
      return
    }
    window.location.reload()
  }

  console.log('application card score', score)

  return (
    <CCard
      key={id}
      style={{
        minWidth: '16rem',
        marginBottom: '1rem',
        border: `solid ${progress2Color[progress]}`,
      }}
    >
      <CCardBody>
        {role === 1 ? (
          <RecruiterCard user_id={user_id} progress={progress} score={score} />
        ) : (
          <ApplicantCard job_id={job_id} progress={progress} />
        )}
        <CCardText as={'div'} style={{ marginBottom: '0.5rem' }}>
          进度：{progress2Info[progress]}
        </CCardText>
        <div className="d-flex justify-content-end">
          <CButton style={{ visibility: 'hidden' }}>N</CButton>
          {role === 1 && (
            <CButton
              onClick={() => {
                navigate(`/resume/${user_id}`)
              }}
              color="info"
              className="text-white"
              style={{ marginRight: '0.5em' }}
            >
              查看简历
            </CButton>
          )}
          {buttonValid && (
            <>
              <CButton
                onClick={handleClick(true)}
                color="success"
                className="text-white"
                style={{ marginRight: '0.5em' }}
              >
                接受
              </CButton>
              <CButton onClick={handleClick(false)} color="danger" className="text-white">
                拒绝
              </CButton>
            </>
          )}
        </div>
      </CCardBody>
    </CCard>
  )
}

ApplicationCard.propTypes = {
  application: PropTypes.shape({
    id: PropTypes.number.isRequired,
    job_id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    score: PropTypes.number,
  }).isRequired,
}

ApplicantCard.propTypes = {
  job_id: PropTypes.number.isRequired,
}

RecruiterCard.propTypes = {
  user_id: PropTypes.number.isRequired,
  score: PropTypes.number,
}

export default ApplicationCard
