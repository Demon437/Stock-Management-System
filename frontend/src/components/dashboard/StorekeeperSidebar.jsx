
import React from 'react'
import { NavLink } from 'react-router-dom'

import {
  FaBox,
  FaUserCircle,
  FaChartBar,
  FaTruck,
  FaFileInvoice,
} from 'react-icons/fa'

import {
  FaGaugeHigh,
  FaList,
} from 'react-icons/fa6'

import { navLinkClass } from '../../constants/sidebarStyles'

const StorekeeperSidebar = () => {
  return (
    <div className="sidebar">

      <div className="flex flex-col gap-2 p-4">

        <NavLink to="/storekeeper-dashboard" end className={navLinkClass}>
          <FaGaugeHigh />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/storekeeper-dashboard/products" className={navLinkClass}>
          <FaBox />
          <span>Products</span>
        </NavLink>

        <NavLink to="/storekeeper-dashboard/categories" className={navLinkClass}>
          <FaList />
          <span>Categories</span>
        </NavLink>

        <NavLink to="/storekeeper-dashboard/suppliers" className={navLinkClass}>
          <FaTruck />
          <span>Suppliers</span>
        </NavLink>

        <NavLink to="/storekeeper-dashboard/purchase-orders" className={navLinkClass}>
          <FaFileInvoice />
          <span>Purchase Orders</span>
        </NavLink>

        <NavLink to="/storekeeper-dashboard/reports" className={navLinkClass}>
          <FaChartBar />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/storekeeper-dashboard/profile" className={navLinkClass}>
          <FaUserCircle />
          <span>Profile</span>
        </NavLink>

      </div>
    </div>
  )
}

export default StorekeeperSidebar
