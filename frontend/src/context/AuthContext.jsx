import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext()

const AuthContext = ({ children }) => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('token')

        if (token) {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })

          if (response.data.success && response.data.user) {
            setUser(response.data.user)
          } else {
            setUser(null)
            localStorage.removeItem("token")
          }

        } else {
          setUser(null)
        }

      } catch (error) {
        setUser(null)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    verifyUser()
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem("token", token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserAuth = () => {
  return useContext(UserContext)
}

export default AuthContext