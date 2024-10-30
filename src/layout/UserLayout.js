import React from 'react'
import { useSelector } from 'react-redux'
import RecruiterLayout from './RecruiterLayout'
import DefaultLayout from './DefaultLayout'

const UserLayout = () => {
  const role = useSelector((state) => state.authReducer.role)
  console.log('UserLayout')
  console.log('role', role)

  return <div>{role === 1 ? <RecruiterLayout /> : <DefaultLayout />}</div>
}

export default UserLayout
