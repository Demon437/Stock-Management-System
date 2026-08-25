import React from 'react'
import { Outlet } from 'react-router-dom'

import AdminSidebar from '../components/dashboard/AdminSidebar'
import NavBar from '../components/dashboard/NavBar'

const AdminDashboard = () => {

  return (

    <div className='dashboard-shell'>

      <NavBar />

      <div className='flex flex-1 overflow-hidden'>

        <AdminSidebar />

        <div className='min-w-0 flex-1 overflow-y-auto p-4'>
          <Outlet />
        </div>

      </div>

    </div>
  )
}

export default AdminDashboard