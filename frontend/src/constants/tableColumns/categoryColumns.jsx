import axios from "axios"
import { useNavigate } from "react-router-dom"

export const columns = [
  {
    name: "S No",
    selector: row => row.sno,
    width: "100px",
    center: true
  },
  {
    name: "Category Name",
    selector: row => row.category_name,
    sortable: true
  },
  {
    name: "Action",
    cell: row => <CategoryButtons id={row._id} />,
    width: "220px",
    center: true
  }
]

const CategoryButtons = ({ id }) => {

  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem("user"))

  const handleDelete = async (id) => {

    try {

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this category?"
      )

      if (!confirmDelete) return

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/category/${id}`,
        {
          data: {
            userId: currentUser?._id
          }
        }
      )

      if (response.data.success) {
        alert("Category deleted successfully")
        window.location.reload()
      }

    } catch (error) {

      console.log(error)

      alert(
        error.response?.data?.error ||
        "Failed to delete category"
      )
    }
  }

  const handleEditClick = () => {

    const path =
      currentUser?.role === "admin"
        ? `/admin-dashboard/categories/${id}`
        : `/storekeeper-dashboard/categories/${id}`

    navigate(path)
  }

  return (
    <div className="flex items-center justify-center gap-3 w-full px-3">

      <button
        onClick={handleEditClick}
        className="bg-[#0F172A] hover:bg-[#1E293B] hover:shadow-md transition transform hover:-translate-y-0.5 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
      >
        Edit
      </button>

      <button
        onClick={() => handleDelete(id)}
        className="bg-red-500 hover:bg-red-600 hover:shadow-md transition transform hover:-translate-y-0.5 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
      >
        Delete
      </button>

    </div>
  )
}