import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import { useSelector } from 'react-redux'

const MyAppContent = () => {
  console.log('MyAppContent')
  const userid = useSelector((state) => state.authReducer.userid)
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="*" element={<Navigate to={`/user/${userid}`} replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(MyAppContent)
