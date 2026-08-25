import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { dataTableCustomStyles } from "../../constants/tableStyles";

function Categories() {

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredCategories, setFilteredCategories] = useState([]);

    const [category, setCategory] = useState({
        category_name: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);


    // ==========================================
    // FETCH CATEGORIES
    // ==========================================

    const fetchCategories = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/category`
            );

            if (response.data.success) {

                let sno = 1;

                const data = response.data.categories.map((cat) => ({
                    _id: cat._id,
                    sno: sno++,
                    category_name: cat.category_name
                }));

                setCategories(data);
                setFilteredCategories(data);
            }

        } catch (error) {

            console.log("GET CATEGORIES ERROR:", error);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    useEffect(() => {

        const result = categories.filter((cat) =>
            cat.category_name
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );

        setFilteredCategories(result);

    }, [search, categories]);


    const handleSearch = (e) => {
        setSearch(e.target.value);
    };


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setCategory({
            ...category,
            [name]: value
        });
    };


    // ==========================================
    // ADD / UPDATE CATEGORY
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const currentUser =
            JSON.parse(localStorage.getItem("user"));

        try {

            if (editingId) {

                // ==================================
                // UPDATE CATEGORY
                // ==================================

                const response = await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/category/${editingId}`,
                    {
                        category_name: category.category_name,
                        userId: currentUser?._id
                    }
                );

                if (response.data.success) {

                    alert("Category updated successfully");

                    resetForm();

                    fetchCategories();
                }

            } else {

                // ==================================
                // ADD CATEGORY
                // ==================================

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/category/add`,
                    {
                        category_name: category.category_name,
                        userId: currentUser?._id
                    }
                );

                if (response.data.success) {

                    alert("Category added successfully");

                    resetForm();

                    fetchCategories();
                }
            }

        } catch (error) {

            console.log("CATEGORY ERROR:", error);

            alert(
                error.response?.data?.error ||
                "Server Error"
            );
        }
    };


    // ==========================================
    // EDIT CATEGORY
    // ==========================================

    const handleEdit = async (id) => {

        try {

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/category/${id}`
            );

            if (response.data.success) {

                const selectedCategory =
                    response.data.category;

                setEditingId(id);

                setCategory({
                    category_name:
                        selectedCategory.category_name || ""
                });

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

        } catch (error) {

            console.log("GET CATEGORY ERROR:", error);

            alert("Failed to load category");
        }
    };


    // ==========================================
    // DELETE CATEGORY
    // ==========================================

    const handleDelete = async (id) => {

        const currentUser =
            JSON.parse(localStorage.getItem("user"));

        try {

            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/category/${id}`,
                {
                    data: {
                        userId: currentUser?._id
                    }
                }
            );

            if (response.data.success) {

                alert("Category deleted successfully");

                // If the deleted category is being edited,
                // clear the form.
                if (editingId === id) {
                    resetForm();
                }

                fetchCategories();
            }

        } catch (error) {

            console.log("DELETE CATEGORY ERROR:", error);

            alert(
                error.response?.data?.error ||
                "Failed to delete category"
            );
        }
    };


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {

        setEditingId(null);

        setCategory({
            category_name: ""
        });
    };


    // ==========================================
    // TABLE COLUMNS
    // ==========================================

    const columns = [

        {
            name: "S.No",
            selector: row => row.sno,
            sortable: true,
            width: "110px",
            center: true
        },

        {
            name: "Category Name",
            selector: row => row.category_name,
            sortable: true,
            grow: 2
        },

        {
            name: "Actions",

            cell: row => (

                <div className="flex items-center justify-center gap-3 w-full px-2">

                    <button
                        type="button"
                        onClick={() => handleEdit(row._id)}
                        className="bg-blue-500 hover:bg-blue-700 hover:shadow-md transition transform hover:-translate-y-0.5 cursor-pointer text-white px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => handleDelete(row._id)}
                        className="w-20 bg-red-500 hover:bg-red-600 hover:shadow-md transition transform hover:-translate-y-0.5 cursor-pointer text-white px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
                    >
                        Delete
                    </button>

                </div>
            ),

            width: "240px",
            center: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
        }

    ];


    return (

        <div className="page-bg">


            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="page-header">

                <h2 className="page-heading">
                    Category Management
                </h2>


                {/* SEARCH */}

                <div className="relative w-full md:w-80">

                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search category..."
                        className="search-input"
                    />

                    <svg
                        className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >

                        <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0 15z" />

                    </svg>

                </div>

            </div>


            {/* =====================================
                ADD / EDIT FORM
            ===================================== */}

            <div className="card-padded mb-6">

                <h3 className="section-heading mb-5">

                    {editingId
                        ? "Edit Category"
                        : "Add New Category"
                    }

                </h3>


                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col md:flex-row gap-4"
                >

                    <div className="flex-1">

                        <label className="input-label">
                            Category Name
                        </label>

                        <input
                            type="text"
                            name="category_name"
                            required
                            value={category.category_name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="flex items-end gap-2">

                        <button
                            type="submit"
                            className="btn-primary"
                        >

                            {editingId
                                ? "Update Category"
                                : "Add Category"
                            }

                        </button>


                        {editingId && (

                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>


            {/* =====================================
                CATEGORY TABLE
            ===================================== */}

            <div className="card p-4">

                <h3 className="section-heading mb-4 px-2">
                    Categories
                </h3>


                {loading ? (

                    <p className="p-4 text-gray-500">
                        Loading categories...
                    </p>

                ) : (

                    <DataTable
                        customStyles={dataTableCustomStyles}
                        columns={columns}
                        data={filteredCategories}
                        pagination
                        highlightOnHover
                        noDataComponent={
                            <div className="p-4 text-gray-500">
                                No categories found
                            </div>
                        }
                    />

                )}

            </div>

        </div>
    );
}

export default Categories;
