import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserAuth } from '../../context/AuthContext'
import axios from 'axios'

function NavBar() {

  const { user } = useUserAuth() || {}

  const storedUser = JSON.parse(localStorage.getItem("user"))
  const currentUser = user || storedUser

  const navigate = useNavigate()

  const handleLogout = async () => {

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"))

      await axios.post(`${import.meta.env.VITE_API_URL}/api/logs/add`, {
        action: "User logged out",
        user: storedUser?.name || storedUser?.email || "Unknown User",
        type: "logout"
      })

    } catch (error) {
      console.log("Logout log failed:", error.response?.data || error.message)
    }

    setTimeout(() => {
      localStorage.removeItem("user")
      localStorage.removeItem("userId")
      navigate('/login')
    }, 100)
  }

  return (
    <div className="navbar">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/30">
          <span className="text-lg font-bold text-slate-950">
            S
          </span>
        </div>

        <p className="text-xl sm:text-2xl font-bold tracking-wide">
          Stock Management System
        </p>

      </div>

      <p className="text-sm sm:text-base font-semibold hidden sm:block">
        Welcome
        <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-cyan-400/20 text-cyan-300 ml-2">
          {currentUser?.name || "Guest"}
        </span>
      </p>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 sm:px-5 py-2 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer"
      >
        Logout
      </button>

    </div>
  )
}

export default NavBar
