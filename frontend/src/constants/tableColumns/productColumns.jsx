import { useNavigate } from "react-router-dom"
import axios from "axios"
import React from "react"

export const columns = [
  {
    name: "S No",
    selector: row => row.sno
  },
  {
    name: "Product Name",
    selector: row => row.product_name
  },
  {
    name: "Category",
    selector: row => row.product_category
  },
  {
    name: "Price",
    selector: row => `Rs. ${row.product_price}`
  },
  {
    name: "Quantity",
    selector: row => row.product_quantity
  },
  {
    name: "Action",
    cell: row => <ProductButtons id={row._id} />
  }
]

const ProductButtons = ({ id }) => {

  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem("user"))

  const handleDelete = async (id) => {

    try {

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      )

      if (!confirmDelete) return

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/product/${id}`,
        {
          data: {
            userId: currentUser?._id
          }
        }
      )

      if (response.data.success) {
        alert("Product deleted successfully")
        window.location.reload()
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = () => {

    const path =
      currentUser?.role === "admin"
        ? `/admin-dashboard/products/${id}`
        : `/storekeeper-dashboard/products/${id}`

    navigate(path)
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
