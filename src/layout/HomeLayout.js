import { CButton, CCard, CCardBody } from '@coreui/react'
import React from 'react'

const HomeLayout = () => {
  return (
    <div className="home-background">
      <div
        style={{
          position: 'fixed',
          bottom: '15%',
          right: '10%',
        }}
      >
        <CCard
          className="flex-grow-1"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0)', border: 'none' }}
        >
          <CCardBody>
            <CButton
              color="dark"
              href="#/login"
              style={{ marginRight: '50px', padding: '12px 20px', fontSize: '1.2rem' }}
            >
              登录
            </CButton>
            <CButton
              color="dark"
              href="#/register"
              style={{ padding: '12px 20px', fontSize: '1.2rem' }}
            >
              注册
            </CButton>
          </CCardBody>
        </CCard>
      </div>
    </div>
  )
}

export default HomeLayout
