
import React from 'react'
import { NavLink } from 'react-router-dom'

import {
  FaClipboardList,
  FaUserCircle,
  FaChartBar,
  FaTruck,
} from 'react-icons/fa'

import {
  FaGaugeHigh,
  FaCheck,
} from 'react-icons/fa6'

import { navLinkClass } from '../../constants/sidebarStyles'

const StaffSidebar = () => {
  return (
    <div className="sidebar">

      <div className="flex flex-col gap-2 p-4">

        <NavLink to="/staff-dashboard" end className={navLinkClass}>
          <FaGaugeHigh />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/staff-dashboard/requests" className={navLinkClass}>
          <FaClipboardList />
          <span>Requests</span>
        </NavLink>

        <NavLink to="/staff-dashboard/approvals-display" className={navLinkClass}>
          <FaCheck />
          <span>Approvals</span>
        </NavLink>

        <NavLink to="/staff-dashboard/suppliers" className={navLinkClass}>
          <FaTruck />
          <span>Suppliers</span>
        </NavLink>

        <NavLink to="/staff-dashboard/reports" className={navLinkClass}>
          <FaChartBar />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/staff-dashboard/profile" className={navLinkClass}>
          <FaUserCircle />
          <span>Profile</span>
        </NavLink>

      </div>
    </div>
  )
}

export default StaffSidebar
