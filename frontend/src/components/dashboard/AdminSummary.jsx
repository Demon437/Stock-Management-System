import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SummaryCard from './SummaryCard'
import DashboardCharts from './DashboardCharts'

import {
  FaBox,
  FaUsers,
  FaClipboardCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa'

import { FaList } from 'react-icons/fa6'

const AdminSummary = () => {

  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    rejectedRequests: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/dashboard/summary`
      )

      if (response.data.success) {
        setSummary(response.data.summary)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-bg">
        <div className="loading-state min-h-[60vh]">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="page-bg">
      <div className="page-container">

        <div className="mb-8">
          <h1 className="page-heading text-4xl">Dashboard Summary</h1>
          <p className="page-subheading">
            Overview of system products, users, and request activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

          <SummaryCard
            icon={<FaBox />}
            text="Total Products"
            number={summary.totalProducts}
            color="border-l-4 border-blue-500"
          />

          <SummaryCard
            icon={<FaList />}
            text="Total Categories"
            number={summary.totalCategories}
            color="border-l-4 border-purple-500"
          />

          <SummaryCard
            icon={<FaUsers />}
            text="Total Users"
            number={summary.totalUsers}
            color="border-l-4 border-cyan-500"
          />

        </div>

        <DashboardCharts summary={summary} />

        <div className="mb-6">
          <h2 className="section-heading text-3xl">Approval Details</h2>
          <p className="section-subheading mb-0">
            Overview of request status breakdown
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <SummaryCard
            icon={<FaClipboardCheck />}
            text="Total Requests"
            number={summary.totalRequests}
            color="border-l-4 border-indigo-500"
          />

          <SummaryCard
            icon={<FaCheckCircle />}
            text="Approved Requests"
            number={summary.approvedRequests}
            color="border-l-4 border-green-500"
          />

          <SummaryCard
            icon={<FaClock />}
            text="Pending Requests"
            number={summary.pendingRequests}
            color="border-l-4 border-yellow-500"
          />

          <SummaryCard
            icon={<FaTimesCircle />}
            text="Rejected Requests"
            number={summary.rejectedRequests}
            color="border-l-4 border-red-500"
          />

        </div>

      </div>
    </div>
  )
}

export default AdminSummary
