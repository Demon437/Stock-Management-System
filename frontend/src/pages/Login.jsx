import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail")

    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: email.trim().toLowerCase(),
          password
        }
      )

      const user = response.data.user

      setSuccessMessage('Login Successful')

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/logs/add`, {
          action: "User logged in",
          user: user.name,
          type: "login"
        })
      } catch (logError) {
        console.log("Log failed:", logError.message)
      }

      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("userId", user._id)

      if (rememberMe) {
        localStorage.setItem("rememberEmail", email)
      } else {
        localStorage.removeItem("rememberEmail")
      }

      if (user.role === "admin") {
        navigate('/admin-dashboard')
      } else if (user.role === "supervisor") {
        navigate('/supervisor-dashboard')
      } else if (user.role === "storekeeper") {
        navigate('/storekeeper-dashboard')
      } else {
        navigate('/staff-dashboard')
      }

    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 'Something went wrong'
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-6 overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-sm scale-[0.94]">

        <div className="backdrop-blur-xl bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6">

          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-xl bg-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-xl font-bold text-slate-950">
                S
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Store MS
          </h2>

          <p className="text-center text-slate-400 mt-2 mb-6 text-sm">
            Sign in to access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl text-sm">
                {successMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2.5 pr-12 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="accent-cyan-400 cursor-pointer"
                />
                Remember Me
              </label>

              
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-semibold py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Login
            </button>

            <div className="border-t border-slate-800"></div>

            

          </form>
        </div>

      </div>
    </div>
  )
}

export default Login