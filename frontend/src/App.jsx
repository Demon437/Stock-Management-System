import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Unauthorized from './pages/Unauthorized'

import AdminDashboard from './pages/AdminDashboard'
import StorekeeperDashboard from './pages/StorekeeperDashboard'
import SupervisorDashboard from './pages/SupervisorDashboard'
import StaffDashboard from './pages/StaffDashboard'
import Suppliers from './components/suppliers/Suppliers'
import PurchaseOrders from './components/purchaseOrders/PurchaseOrders'

import ProtectedRoute from './components/protectedRoutes/ProtectedRoute'

import AdminSummary from './components/dashboard/AdminSummary'

import Products from './components/products/Products'


import Categories from './components/categories/Categories'


import Users from './components/users/Users'

import RequestPage from './components/requests/RequestPage'


import ApprovalsManage from './components/approvals/ApprovalsManage'
import ApprovalsDisplay from './components/approvals/ApprovalsDisplay'

import Reports from './components/reports/Reports'
import LoginActivityPage from './components/reports/LoginActivityPage'
import SystemLogPage from './components/reports/SystemLogPage'
import LowStockPage from './components/reports/LowStockPage'
import StockActivityPage from './components/reports/StockActivityPage'
import FullReportPage from './components/reports/FullReportPage'

import Profile from './components/profile/Profile'
import EditProfile from './components/profile/EditProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          
          <Route path="categories" element={<Categories />} />
          
          <Route path="requests" element={<RequestPage />} />
          
          <Route path="approvals" element={<ApprovalsManage />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="reports" element={<Reports />} />
          <Route path="login-activity" element={<LoginActivityPage />} />
          <Route path="system-logs" element={<SystemLogPage />} />
          <Route path="low-stock" element={<LowStockPage />} />
          <Route path="stock-activity" element={<StockActivityPage />} />
          <Route path="export" element={<FullReportPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

        {/* Storekeeper */}
        <Route
          path="/storekeeper-dashboard"
          element={
            <ProtectedRoute allowedRoles={['storekeeper', 'admin']}>
              <StorekeeperDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="products" element={<Products />} />
          
          <Route path="categories" element={<Categories />} />
          
          
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="reports" element={<Reports />} />
          <Route path="low-stock" element={<LowStockPage />} />
          <Route path="stock-activity" element={<StockActivityPage />} />
          <Route path="export" element={<FullReportPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

        {/* Supervisor */}
        <Route
          path="/supervisor-dashboard"
          element={
            <ProtectedRoute allowedRoles={['supervisor']}>
              <SupervisorDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="approvals" element={<ApprovalsManage />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="reports" element={<Reports />} />
          <Route path="low-stock" element={<LowStockPage />} />
          <Route path="stock-activity" element={<StockActivityPage />} />
          <Route path="export" element={<FullReportPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

        {/* Staff */}
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="requests" element={<RequestPage />} />
          
          <Route path="approvals-display" element={<ApprovalsDisplay />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="low-stock" element={<LowStockPage />} />
          <Route path="export" element={<FullReportPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
