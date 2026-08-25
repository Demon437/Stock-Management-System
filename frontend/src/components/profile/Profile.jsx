import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Profile = () => {

    const navigate = useNavigate()
    const userId = localStorage.getItem("userId") 

    const [user, setUser] = useState(null)

    useEffect(() => {

        const fetchUser = async () => {
            try {

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/user/${userId}`
                )

                if (response.data.success) {
                    setUser(response.data.user)
                }

            } catch (error) {
                console.log(error)
            }
        }

        fetchUser()

    }, [userId])


    if (!user) {
        return (
          <div className="page-bg">
            <div className="loading-state min-h-[60vh]">Loading profile...</div>
          </div>
        );
    }

    const role = JSON.parse(localStorage.getItem("user"))

    const rolePathMap = {
      admin: "admin-dashboard",
      storekeeper: "storekeeper-dashboard",
      supervisor: "supervisor-dashboard",
      staff: "staff-dashboard",
    }

return (
  <div className="page-bg flex flex-col items-center gap-6">

    <div className="w-full max-w-6xl card-header mb-0">
      <h1 className="page-heading text-4xl">
        My Profile
      </h1>
      <p className="page-subheading">
        Manage and access your profile
      </p>
    </div>

    <div className="w-full max-w-md card-padded hover:shadow-md transition-all duration-200">

      <h2 className="section-heading text-center mb-6">
        Account Details
      </h2>

      <div className="space-y-4 text-center">

        <div>
          <p className="text-sm text-slate-500">Name</p>
          <p className="text-lg font-semibold text-[#0F172A]">{user.name}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Email</p>
          <p className="text-lg font-semibold text-[#0F172A]">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Role</p>
          <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-cyan-100 text-cyan-900">
            {user.role}
          </span>
        </div>

      </div>

      <div className="mt-6">

        <button
          onClick={() =>
            navigate(`/${rolePathMap[role?.role]}/edit-profile`)
          }
          className="w-full bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-semibold py-2.5 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer"
        >
          Edit Profile
        </button>

      </div>

    </div>

  </div>
);
}

export default Profile
