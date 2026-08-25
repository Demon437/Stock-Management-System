
import React from 'react'
import { NavLink } from 'react-router-dom'

import {
  FaUserCircle,
  FaChartBar,
  FaFileInvoice,
} from 'react-icons/fa'

import {
  FaGaugeHigh,
  FaCheck,
} from 'react-icons/fa6'

import { navLinkClass } from '../../constants/sidebarStyles'

const SupervisorSidebar = () => {
  return (
    <div className="sidebar">

      <div className="flex flex-col gap-2 p-4">

        <NavLink to="/supervisor-dashboard" end className={navLinkClass}>
          <FaGaugeHigh />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/supervisor-dashboard/approvals" className={navLinkClass}>
          <FaCheck />
          <span>Approvals</span>
        </NavLink>

        <NavLink to="/supervisor-dashboard/purchase-orders" className={navLinkClass}>
          <FaFileInvoice />
          <span>Purchase Orders</span>
        </NavLink>

        <NavLink to="/supervisor-dashboard/reports" className={navLinkClass}>
          <FaChartBar />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/supervisor-dashboard/profile" className={navLinkClass}>
          <FaUserCircle />
          <span>Profile</span>
        </NavLink>

      </div>
    </div>
  )
}

export default SupervisorSidebar
