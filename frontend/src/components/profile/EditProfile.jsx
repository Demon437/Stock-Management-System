import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from "react-icons/fi"

const EditProfile = () => {

    const navigate = useNavigate()
    const userId = localStorage.getItem("userId")

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(true)

    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {

        const fetchUser = async () => {
            try {

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/user/${userId}`
                )

                if (response.data.success) {
                    setUser({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        password: "",
                    })
                }       

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()

    }, [userId])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }

    const handleImage = (e) => {
        const file = e.target.files[0]

        const reader = new FileReader()

        reader.onloadend = () => {
            setUser({ ...user})
        }

        if (file) {
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

    const currentUser = JSON.parse(localStorage.getItem("user")); 
        
        try {

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/user/${userId}`,
                user
            )

            if (response.data.success) {
                try {
                    await axios.post(`${import.meta.env.VITE_API_URL}/api/logs/add`, {
                        action: "Updated profile",
                        user: currentUser?.name,
                        type: "profile"
                    })
                } catch (logError) {
                    console.log("Log failed:", logError.message)
                }

                alert("Profile updated successfully")
                navigate(-1)
            }

        } catch (error) {
            console.log(error)
        }
    }

    if (loading){ 
        return (
            <div className="page-bg">
                <div className="loading-state min-h-[60vh]">Loading profile...</div>
            </div>
        );
    }
    return (
        <div className="page-bg flex items-center justify-center">

            <div className="w-full max-w-md card-padded">

                <h2 className="section-heading text-center mb-5">
                    Edit Profile
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="input-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="input-label">Password</label>
                        <div className="relative">

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                placeholder="New Password (optional)"
                                className="input-field pr-10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>

                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">

                        <button
                            type="submit"
                            className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-semibold py-2.5 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer"
                        >
                            Update Profile
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 btn-secondary"
                        >
                            Back
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default EditProfile
