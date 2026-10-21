import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './components/Home'
import Signup from './components/Signup'
import Login from './components/Login'
import Jobs from './components/jobs'
import Browse from './components/Browse'
import JobDescription from './components/JobDescription'
import Profile from './components/Profile'
import ViewProfile from './components/viewprofile'
import EditProfile from './components/EditProfile'
import RecruiterDashboard from './components/RecruiterDashboard'
import CreateCompany from './components/CreateCompany'
import PostJob from './components/PostJob'
import MyJobs from './components/MyJobs'
import Applications from './components/Applications'
import AppliedJobs from './components/AppliedJobs'
import ApplicationDetails from './components/ApplicationDetails'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/description/:id',
    element: <JobDescription />
  },
  {
    path: '/profile',
    element: <ViewProfile />
  },
  {
    path: '/edit-profile',
    element: <EditProfile />
  },
  {
    path: '/recruiter-dashboard',
    element: <RecruiterDashboard />
  },
  {
    path: '/create-company',
    element: <CreateCompany />
  },
  {
    path: '/post-job',
    element: <PostJob />
  },
  {
    path: '/my-jobs',
    element: <MyJobs />
},
{
    path: '/applications',
    element: <Applications />
},
{
    path: '/applied-jobs',
    element: <AppliedJobs />
},
{
    path: '/application-details/:id',
    element: <ApplicationDetails />
}
])

function App() {
  return <RouterProvider router={appRouter} />
}

export default App