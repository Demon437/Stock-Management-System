import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { dataTableCustomStyles } from "../../constants/tableStyles";

function Products() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [categories, setCategories] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [product, setProduct] = useState({
        product_name: "",
        product_price: "",
        product_category: "",
        product_quantity: ""
    });


    // ==========================================
    // FETCH PRODUCTS
    // ==========================================

    const fetchProducts = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/product`
            );

            if (response.data.success) {

                let sno = 1;

                const data = response.data.products.map((pro) => ({
                    _id: pro._id,
                    sno: sno++,
                    product_name: pro.product_name,
                    product_category: pro.product_category,
                    product_price: pro.product_price,
                    product_quantity: pro.product_quantity
                }));

                setProducts(data);
                setFilteredProducts(data);
            }

        } catch (error) {

            console.log("GET PRODUCTS ERROR:", error);

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // FETCH CATEGORIES
    // ==========================================

    const fetchCategories = async () => {

        try {

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/category`
            );

            if (response.data.success) {
                setCategories(response.data.categories);
            }

        } catch (error) {

            console.log("GET CATEGORIES ERROR:", error);

        }
    };


    useEffect(() => {

        fetchProducts();
        fetchCategories();

    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    useEffect(() => {

        const result = products.filter((product) =>
            product.product_name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            product.product_category
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );

        setFilteredProducts(result);

    }, [search, products]);


    const handleSearch = (e) => {
        setSearch(e.target.value);
    };


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setProduct({
            ...product,
            [name]: value
        });
    };


    // ==========================================
    // ADD / UPDATE PRODUCT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const currentUser =
            JSON.parse(localStorage.getItem("user"));

        const qty = Number(product.product_quantity);

        // Quantity validation

        if (!qty || qty <= 0) {

            return alert(
                "Quantity must be greater than 0"
            );
        }

        if (!Number.isInteger(qty)) {

            return alert(
                "Quantity must be a valid whole number"
            );
        }


        try {

            if (editingId) {

                // ==================================
                // UPDATE PRODUCT
                // ==================================

                const response = await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/product/${editingId}`,
                    {
                        product_name: product.product_name,
                        product_price: Number(product.product_price),
                        product_category: product.product_category,
                        product_quantity: qty,
                        userId: currentUser?._id
                    }
                );

                if (response.data.success) {

                    alert("Product updated successfully");

                    resetForm();

                    fetchProducts();
                }

            } else {

                // ==================================
                // ADD PRODUCT
                // ==================================

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/product/add`,
                    {
                        product_name: product.product_name,
                        product_price: Number(product.product_price),
                        product_category: product.product_category,
                        product_quantity: qty,
                        userId: currentUser?._id
                    }
                );

                if (response.data.success) {

                    alert("Product added successfully");

                    resetForm();

                    fetchProducts();
                }
            }

        } catch (error) {

            console.log("PRODUCT ERROR:", error);

            alert(
                error.response?.data?.error ||
                "Server Error"
            );
        }
    };


    // ==========================================
    // EDIT PRODUCT
    // ==========================================

    const handleEdit = async (id) => {

        try {

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/product/${id}`
            );

            if (response.data.success) {

                const selectedProduct =
                    response.data.product;

                setEditingId(id);

                setProduct({
                    product_name:
                        selectedProduct.product_name || "",

                    product_price:
                        selectedProduct.product_price || "",

                    product_category:
                        selectedProduct.product_category || "",

                    product_quantity:
                        selectedProduct.product_quantity || ""
                });

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

        } catch (error) {

            console.log("GET PRODUCT ERROR:", error);

            alert("Failed to load product");
        }
    };


    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        const currentUser =
            JSON.parse(localStorage.getItem("user"));

        try {

            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/product/${id}`,
                {
                    data: {
                        userId: currentUser?._id
                    }
                }
            );

            if (response.data.success) {

                alert("Product deleted successfully");

                // If deleted product was being edited
                if (editingId === id) {
                    resetForm();
                }

                fetchProducts();
            }

        } catch (error) {

            console.log("DELETE PRODUCT ERROR:", error);

            alert(
                error.response?.data?.error ||
                "Failed to delete product"
            );
        }
    };


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {

        setEditingId(null);

        setProduct({
            product_name: "",
            product_price: "",
            product_category: "",
            product_quantity: ""
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
            width: "80px"
        },

        {
            name: "Product",
            selector: row => row.product_name,
            sortable: true,
            grow: 2
        },

        {
            name: "Category",
            selector: row => row.product_category,
            sortable: true,
            grow: 1.5
        },

        {
            name: "Price",
            selector: row => row.product_price,
            sortable: true,
            width: "130px",

            cell: row => (
                <span className="font-semibold text-gray-800">
                    {row.product_price}
                </span>
            )
        },

        {
            name: "Quantity",
            selector: row => row.product_quantity,
            sortable: true,
            width: "120px"
        },

        {
            name: "Actions",

            cell: row => (

                <div className="flex items-center justify-center gap-2 w-full">

                    <button
                        onClick={() => handleEdit(row._id)}
                        className="btn-edit"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => handleDelete(row._id)}
                        className="btn-delete"
                    >
                        Delete
                    </button>

                </div>
            ),

            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "220px"
        }

    ];


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="page-bg">


            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="page-header">

                <h2 className="page-heading">
                    Product Management
                </h2>


                {/* SEARCH */}

                <div className="relative w-full md:w-80">

                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search product..."
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
                ADD / EDIT PRODUCT FORM
            ===================================== */}

            <div className="card-padded mb-6">

                <h3 className="section-heading mb-5">

                    {editingId
                        ? "Edit Product"
                        : "Add New Product"
                    }

                </h3>


                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >


                    {/* PRODUCT NAME */}

                    <div>

                        <label className="input-label">
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="product_name"
                            required
                            value={product.product_name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            className="input-field"
                        />

                    </div>


                    {/* PRODUCT PRICE */}

                    <div>

                        <label className="input-label">
                            Product Price
                        </label>

                        <input
                            type="number"
                            name="product_price"
                            required
                            min="0"
                            step="0.01"
                            value={product.product_price}
                            onChange={handleChange}
                            placeholder="Enter product price"
                            className="input-field"
                        />

                    </div>


                    {/* CATEGORY */}

                    <div>

                        <label className="input-label">
                            Product Category
                        </label>

                        <select
                            name="product_category"
                            required
                            value={product.product_category}
                            onChange={handleChange}
                            className="input-field"
                        >

                            <option value="">
                                Select Category
                            </option>

                            {categories.map((cat) => (

                                <option
                                    key={cat._id}
                                    value={cat.category_name}
                                >
                                    {cat.category_name}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* QUANTITY */}

                    <div>

                        <label className="input-label">
                            Quantity
                        </label>

                        <input
                            type="number"
                            name="product_quantity"
                            required
                            min="1"
                            step="1"
                            value={product.product_quantity}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            className="input-field"
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="flex gap-2 md:col-span-2 pt-2">

                        <button
                            type="submit"
                            className="btn-primary"
                        >

                            {editingId
                                ? "Update Product"
                                : "Add Product"
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
                PRODUCTS TABLE
            ===================================== */}

            <div className="card p-4">

                <h3 className="section-heading mb-4 px-2">
                    Products
                </h3>


                {loading ? (

                    <p className="p-4 text-gray-500">
                        Loading products...
                    </p>

                ) : (

                    <DataTable
                        customStyles={dataTableCustomStyles}
                        columns={columns}
                        data={filteredProducts}
                        pagination
                        highlightOnHover
                        responsive
                        noDataComponent={
                            <div className="p-4 text-gray-500">
                                No products found
                            </div>
                        }
                    />

                )}

            </div>

        </div>
    );
}

export default Products;
