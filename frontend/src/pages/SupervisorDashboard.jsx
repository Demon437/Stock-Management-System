import React from 'react'
import { Outlet } from 'react-router-dom'

import NavBar from '../components/dashboard/NavBar'
import SupervisorSidebar from '../components/dashboard/SupervisorSidebar'

const SupervisorDashboard = () => {

  return (

    <div className='dashboard-shell'>

      <NavBar />

      <div className='flex flex-1 overflow-hidden'>

        <SupervisorSidebar />

        <div className='flex-1 overflow-y-auto p-4'>
          <Outlet />
        </div>

      </div>

    </div>
  )
}

export default SupervisorDashboard