import React from 'react'

const Profile = React.lazy(() => import('./views/Profile'))
const JobPosting = React.lazy(() => import('./views/JobPosting'))
const AllJobs = React.lazy(() => import('./views/AllJobs'))
const JobDetail = React.lazy(() => import('./views/JobDetail'))
const Resume = React.lazy(() => import('./views/Resume'))
const MyApplication = React.lazy(() => import('./views/MyApplication'))
const ApplicationForJob = React.lazy(() => import('./views/ApplicationForJob'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/user/:id', element: Profile },
  { path: '/job-posting', element: JobPosting },
  { path: '/all-jobs', element: AllJobs },
  { path: '/job/:id', element: JobDetail },
  { path: '/resume/:id', element: Resume },
  { path: '/application', element: MyApplication, exact: true },
  { path: '/application/job/:id', element: ApplicationForJob },
]

export default routes
