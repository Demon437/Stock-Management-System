import React from 'react'
import { Outlet } from 'react-router-dom'

import StaffSidebar from '../components/dashboard/StaffSidebar'
import NavBar from '../components/dashboard/NavBar'

const StaffDashboard = () => {

  return (

    <div className='dashboard-shell'>

      <NavBar />

      <div className='flex flex-1 overflow-hidden'>

        <StaffSidebar />

        <div className='flex-1 overflow-y-auto p-4'>
          <Outlet />
        </div>

      </div>

    </div>
  )
}

export default StaffDashboard