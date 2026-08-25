
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { dataTableCustomStyles } from "../../constants/tableStyles";

const inputClass = "input-field";

function Suppliers() {

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        supplier_name: "",
        company_name: "",
        email: "",
        phone: "",
        address: "",
        status: "Active"
    });

    const [editingId, setEditingId] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));


    // ==========================================
    // LOAD SUPPLIERS
    // ==========================================

    const loadSuppliers = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/supplier`
            );

            if (response.data.success) {

                setSuppliers(
                    response.data.suppliers || []
                );

            }

        } catch (error) {

            console.error(
                "GET SUPPLIERS ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadSuppliers();

    }, []);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };


    // ==========================================
    // ADD / UPDATE SUPPLIER
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                const response = await axios.put(

                    `${import.meta.env.VITE_API_URL}/api/supplier/${editingId}`,

                    {

                        ...formData,

                        userId: user?._id

                    }

                );

                if (response.data.success) {

                    alert(
                        "Supplier updated successfully"
                    );

                }

            } else {

                const response = await axios.post(

                    `${import.meta.env.VITE_API_URL}/api/supplier/add`,

                    {

                        ...formData,

                        userId: user?._id

                    }

                );

                if (response.data.success) {

                    alert(
                        "Supplier added successfully"
                    );

                }

            }

            resetForm();

            loadSuppliers();

        } catch (error) {

            console.error(
                "SUPPLIER ERROR:",
                error
            );

            alert(

                error.response?.data?.error ||

                error.response?.data?.message ||

                "Something went wrong"

            );

        }

    };


    // ==========================================
    // EDIT SUPPLIER
    // ==========================================

    const handleEdit = (supplier) => {

        setEditingId(supplier._id);

        setFormData({

            supplier_name:
                supplier.supplier_name || "",

            company_name:
                supplier.company_name || "",

            email:
                supplier.email || "",

            phone:
                supplier.phone || "",

            address:
                supplier.address || "",

            status:
                supplier.status || "Active"

        });

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };


    // ==========================================
    // DELETE SUPPLIER
    // ==========================================

    const handleDelete = async (id) => {

        try {

            const response = await axios.delete(

                `${import.meta.env.VITE_API_URL}/api/supplier/${id}`,

                {

                    data: {

                        userId: user?._id

                    }

                }

            );

            if (response.data.success) {

                alert(
                    "Supplier deleted successfully"
                );

                loadSuppliers();

            }

        } catch (error) {

            console.error(
                "DELETE SUPPLIER ERROR:",
                error
            );

            alert(

                error.response?.data?.error ||

                error.response?.data?.message ||

                "Failed to delete supplier"

            );

        }

    };


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {

        setEditingId(null);

        setFormData({

            supplier_name: "",

            company_name: "",

            email: "",

            phone: "",

            address: "",

            status: "Active"

        });

    };


    // ==========================================
    // TABLE COLUMNS
    // ==========================================

    const columns = [

        {
            name: "S.No",
            selector: (row) => row.sno,
            sortable: true,
            width: "60px"
        },

        {
            name: "Supplier",
            selector: (row) => row.supplier_name,
            sortable: true,
            grow: 1.4
        },

        {
            name: "Company",
            selector: (row) => row.company_name,
            sortable: true,
            grow: 1.5
        },

        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
            grow: 1.8
        },

        {
            name: "Phone",
            selector: (row) => row.phone,
            sortable: true,
            width: "120px"
        },

        {
            name: "Address",
            selector: (row) => row.address,
            sortable: true,
            grow: 2
        },

        {
            name: "Status",

            selector: (row) => row.status,

            sortable: true,

            width: "100px",

            cell: (row) => (

                <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${row.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {row.status}
                </span>

            )
        },

        {
            name: "Actions",

            cell: (row) => (

                <div className="flex w-full items-center justify-center gap-1 whitespace-nowrap">

                    <button
                        type="button"
                        onClick={() => handleEdit(row)}
                        className="btn-edit !px-2 !py-1 text-xs whitespace-nowrap"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => handleDelete(row._id)}
                        className="btn-delete !px-2 !py-1 text-xs whitespace-nowrap"
                    >
                        Delete
                    </button>

                </div>

            ),

            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "145px"
        }

    ];


    // ==========================================
    // TABLE DATA
    // ==========================================

    const tableData = suppliers.map((supplier, index) => ({

        ...supplier,

        sno: index + 1

    }));


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
                    Supplier Management
                </h2>

            </div>


            {/* =====================================
                SUPPLIER FORM
            ===================================== */}

            <div className="card-padded mb-6">

                <h3 className="section-heading mb-5">

                    {editingId
                        ? "Edit Supplier"
                        : "Add New Supplier"
                    }

                </h3>


                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    <div>

                        <label className="input-label">
                            Supplier Name
                        </label>

                        <input
                            type="text"
                            name="supplier_name"
                            placeholder="Enter supplier name"
                            value={formData.supplier_name}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />

                    </div>


                    <div>

                        <label className="input-label">
                            Company Name
                        </label>

                        <input
                            type="text"
                            name="company_name"
                            placeholder="Enter company name"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />

                    </div>


                    <div>

                        <label className="input-label">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />

                    </div>


                    <div>

                        <label className="input-label">
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />

                    </div>


                    <div className="md:col-span-2">

                        <label className="input-label">
                            Address
                        </label>

                        <input
                            type="text"
                            name="address"
                            placeholder="Enter supplier address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />

                    </div>


                    {editingId && (

                        <div>

                            <label className="input-label">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={inputClass}
                            >

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>

                    )}


                    <div className="flex items-end gap-2 md:col-span-2 pt-2">

                        <button
                            type="submit"
                            className="btn-primary"
                        >

                            {editingId
                                ? "Update Supplier"
                                : "Add Supplier"
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
                SUPPLIER TABLE
            ===================================== */}

            <div className="card p-4">

                <h3 className="section-heading mb-4 px-2">
                    Suppliers
                </h3>


                {loading ? (

                    <p className="p-4 text-gray-500">
                        Loading suppliers...
                    </p>

                ) : (

                    <DataTable
                        customStyles={dataTableCustomStyles}
                        columns={columns}
                        data={tableData}
                        pagination
                        highlightOnHover
                        responsive
                        noDataComponent={
                            <div className="p-4 text-gray-500">
                                No suppliers found
                            </div>
                        }
                    />

                )}

            </div>

        </div>

    );

}

export default Suppliers;
