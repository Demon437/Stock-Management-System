
import React from 'react'
import { NavLink } from 'react-router-dom'

import {
  FaBox,
  FaClipboardList,
  FaUsers,
  FaUserCircle,
  FaChartBar,
  FaTruck,
  FaFileInvoice,
} from 'react-icons/fa'

import {
  FaGaugeHigh,
  FaList,
  FaCheck,
} from 'react-icons/fa6'

import { navLinkClass } from '../../constants/sidebarStyles'

const AdminSidebar = () => {
  return (
    <div className="sidebar">

      <div className="flex flex-col gap-2 p-4">

        <NavLink to="/admin-dashboard" end className={navLinkClass}>
          <FaGaugeHigh />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin-dashboard/products" className={navLinkClass}>
          <FaBox />
          <span>Products</span>
        </NavLink>

        <NavLink to="/admin-dashboard/categories" className={navLinkClass}>
          <FaList />
          <span>Categories</span>
        </NavLink>

        <NavLink to="/admin-dashboard/requests" className={navLinkClass}>
          <FaClipboardList />
          <span>Requests</span>
        </NavLink>

        <NavLink to="/admin-dashboard/approvals" className={navLinkClass}>
          <FaCheck />
          <span>Approvals</span>
        </NavLink>

        <NavLink to="/admin-dashboard/suppliers" className={navLinkClass}>
          <FaTruck />
          <span>Suppliers</span>
        </NavLink>

        <NavLink to="/admin-dashboard/purchase-orders" className={navLinkClass}>
          <FaFileInvoice />
          <span>Purchase Orders</span>
        </NavLink>

        <NavLink to="/admin-dashboard/users" className={navLinkClass}>
          <FaUsers />
          <span>Users</span>
        </NavLink>

        <NavLink to="/admin-dashboard/reports" className={navLinkClass}>
          <FaChartBar />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/admin-dashboard/profile" className={navLinkClass}>
          <FaUserCircle />
          <span>Profile</span>
        </NavLink>

      </div>
    </div>
  )
}

export default AdminSidebar
