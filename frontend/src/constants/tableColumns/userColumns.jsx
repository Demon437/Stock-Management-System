import axios from "axios"
import { useNavigate } from "react-router-dom"

export const columns = [
    {
        name: "S No",
        selector: row => row.sno
    },
    {
        name: "Name",
        selector: row => row.name
    },
    {
        name: "Email",
        selector: row => row.email
    },
    {
        name: "Role",
        selector: row => row.role
    },
    {
        name: "Action",
        cell: row => <UserButtons id={row._id} />
    }
]

const UserButtons = ({ id }) => {

    const navigate = useNavigate()

    const handleDelete = async (id) => {

        try {

            const confirmDelete = window.confirm("Delete this user?")

            if (!confirmDelete) return

            const currentUser = JSON.parse(localStorage.getItem("user"));
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/user/${id}`,
                {
                    data: {
                    userId: currentUser?._id 
                    }
                }
            );

            if (response.data.success) {

                alert("User deleted")
                window.location.reload()

            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = async () => {

        navigate(`/admin-dashboard/users/${id}`)
    }

    return (
        <div className="flex gap-2">

            <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white px-2 py-1 rounded"
            >
                Edit
            </button>

            <button
                onClick={() => handleDelete(id)}
                className="bg-red-500 hover:bg-red-700 cursor-pointer text-white px-2 py-1 rounded"
            >
                Delete
            </button>

        </div>
    )
}
