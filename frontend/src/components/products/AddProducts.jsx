import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddProducts = () => {

    const [product, setProduct] = useState({
        product_name: "",
        product_price: "",
        product_category: "",
        product_quantity: ""
    })

    const [categories, setCategories] = useState([])

    const navigate = useNavigate()

    useEffect(() => {

        const fetchCategories = async () => {
            
            try {

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/category`
                )

                if (response.data.success) {
                    setCategories(response.data.categories)
                }

            } catch (error) {
                console.log(error)
            }
        }

        fetchCategories()

    }, [])

    const handleChange = (e) => {

        const { name, value } = e.target

        setProduct({
            ...product,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const currentUser = JSON.parse(localStorage.getItem("user"));

        const qty = Number(product.product_quantity)

        if (!qty || qty <= 0) {
            return alert("Quantity must be greater than 0")
        }

        if (!Number.isInteger(qty)) {
            return alert("Quantity must be a valid whole number")
        }

        try {

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/product/add`,
                {
                    product_name: product.product_name,
                    product_price: Number(product.product_price),
                    product_category: product.product_category,
                    product_quantity: qty,
                    userId: currentUser?._id
                }
            )

            if (response.data.success) {

                alert("Product Added Successfully")

                setProduct({
                    product_name: "",
                    product_price: "",
                    product_category: "",
                    product_quantity: ""
                })

                navigate(-1)
            }

        } catch (error) {

            console.log(error)

            alert(
                error.response?.data?.error || "Server Error"
            )
        }
    }

    return (

        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#E0F2FE] to-[#BAE6FD] flex items-center justify-center px-4">

            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg p-5">

                <h3 className="text-2xl font-bold text-[#0F172A] mb-5 text-center">
                    Add Product
                </h3>

                <form className="space-y-3" onSubmit={handleSubmit}>

                    <div className="flex flex-col gap-1">

                        <label className="text-sm font-bold text-gray-800">
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="product_name"
                            required
                            value={product.product_name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            className="px-3 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 font-semibold placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                        />

                    </div>

                    <div className="flex flex-col gap-1">

                        <label className="text-sm font-bold text-gray-800">
                            Product Price
                        </label>

                        <input
                            type="number"
                            name="product_price"
                            required
                            value={product.product_price}
                            onChange={handleChange}
                            placeholder="Enter product price"
                            className="px-3 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 font-semibold placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                        />

                    </div>

                    <div className="flex flex-col gap-1">

                        <label className="text-sm font-bold text-gray-800">
                            Product Category
                        </label>

                        <select
                            name="product_category"
                            required
                            value={product.product_category}
                            onChange={handleChange}
                            className="px-3 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 font-semibold outline-none focus:ring-2 focus:ring-cyan-400 appearance-none"
                        >

                            <option value="">
                                Select Category
                            </option>

                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.category_name}>
                                    {cat.category_name}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="flex flex-col gap-1">

                        <label className="text-sm font-bold text-gray-800">
                            Quantity
                        </label>

                        <input
                            type="number"
                            name="product_quantity"
                            required
                            value={product.product_quantity}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            className="px-3 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 font-semibold placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                        />

                    </div>

                    <div className="flex gap-2 pt-2">

                        <button
                            type="submit"
                            className="flex-1 bg-cyan-400 hover:bg-cyan-500 hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer text-black font-semibold py-2.5 rounded-lg transition"
                        >
                            Add
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-gray-700 hover:bg-gray-800 hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer text-white font-semibold py-2.5 rounded-lg transition"
                        >
                            Back
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default AddProducts