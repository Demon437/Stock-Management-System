import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { dataTableCustomStyles } from "../../constants/tableStyles";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Users() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });


    // ================================
    // FETCH USERS
    // ================================

    const fetchUsers = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/user`
            );

            if (response.data.success) {

                let sno = 1;

                const data = response.data.users.map((u) => ({
                    _id: u._id,
                    sno: sno++,
                    name: u.name,
                    email: u.email,
                    role: u.role
                }));

                setUsers(data);
                setFilteredUsers(data);
            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchUsers();

    }, []);


    // ================================
    // SEARCH
    // ================================

    const handleSearch = (e) => {

        const value = e.target.value.toLowerCase();

        setSearch(value);

        const filtered = users.filter((item) =>
            item.name?.toLowerCase().includes(value) ||
            item.email?.toLowerCase().includes(value) ||
            item.role?.toLowerCase().includes(value)
        );

        setFilteredUsers(filtered);
    };


    // ================================
    // HANDLE INPUT
    // ================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setUser({
            ...user,
            [name]: value
        });
    };


    // ================================
    // ADD / UPDATE USER
    // ================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const currentUser =
            JSON.parse(localStorage.getItem("user"));

        try {

            if (editingId) {

                // UPDATE USER

                const response = await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/user/${editingId}`,
                    {
                        ...user,
                        userId: currentUser?._id
                    }
                );

                if (response.data.success) {

                    alert("User updated successfully");

                    resetForm();

                    fetchUsers();
                }

            } else {

                // ADD USER

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/user/add`,
                    {
                        ...user,
                        userId: currentUser?._id
                    }
                );

                if (response.data.success) {

                    alert("User added successfully");

                    resetForm();

                    fetchUsers();
                }
            }

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.error ||
                "Something went wrong"
            );
        }
    };


    // ================================
    // EDIT USER
    // ================================

    const handleEdit = async (id) => {

        try {

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/user/${id}`
            );

            if (response.data.success) {

                const selectedUser = response.data.user;

                setEditingId(id);

                setUser({
                    name: selectedUser.name || "",
                    email: selectedUser.email || "",
                    password: "",
                    role: selectedUser.role || ""
                });

                setShowPassword(false);

                // Scroll to form
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

        } catch (error) {

            console.log(error);

            alert("Failed to load user");
        }
    };


    // ================================
    // RESET FORM
    // ================================

    const resetForm = () => {

        setEditingId(null);

        setShowPassword(false);

        setUser({
            name: "",
            email: "",
            password: "",
            role: ""
        });
    };


    // ================================
    // TABLE COLUMNS
    // ================================

    const columns = [

        {
            name: "S.No",
            selector: row => row.sno,
            sortable: true,
            width: "80px"
        },

        {
            name: "Name",
            selector: row => row.name,
            sortable: true
        },

        {
            name: "Email",
            selector: row => row.email,
            sortable: true
        },

        {
            name: "Role",
            selector: row => row.role,
            sortable: true,

            cell: row => (

                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        row.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : row.role === "supervisor"
                            ? "bg-purple-100 text-purple-700"
                            : row.role === "storekeeper"
                            ? "bg-cyan-100 text-cyan-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    {row.role}
                </span>

            )
        },

        {
            name: "Actions",

            cell: row => (

                <button
                    onClick={() => handleEdit(row._id)}
                    className="btn-edit"
                >
                    Edit
                </button>

            ),

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
                    User Management
                </h2>


                {/* SEARCH */}

                <div className="relative w-full md:w-80">

                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search users..."
                        className="search-input"
                    />

                    <svg
                        className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15z" />
                    </svg>

                </div>

            </div>


            {/* =====================================
                ADD / EDIT USER FORM
            ===================================== */}

            <div className="card-padded mb-6">

                <h3 className="section-heading mb-5">

                    {editingId
                        ? "Edit User"
                        : "Add New User"
                    }

                </h3>


                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >


                    {/* NAME */}

                    <div>

                        <label className="input-label">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            required
                            className="input-field"
                        />

                    </div>


                    {/* EMAIL */}

                    <div>

                        <label className="input-label">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                            className="input-field"
                        />

                    </div>


                    {/* PASSWORD */}

                    <div>

                        <label className="input-label">

                            Password

                            {editingId && (
                                <span className="text-gray-400 font-normal ml-1">
                                    (leave blank to keep current)
                                </span>
                            )}

                        </label>


                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                placeholder={
                                    editingId
                                        ? "Enter new password"
                                        : "Enter password"
                                }
                                required={!editingId}
                                className="w-full px-4 py-2 pr-11 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800 cursor-pointer"
                            >

                                {showPassword
                                    ? <FiEyeOff size={19} />
                                    : <FiEye size={19} />
                                }

                            </button>

                        </div>

                    </div>


                    {/* ROLE */}

                    <div>

                        <label className="input-label">
                            Role
                        </label>

                        <select
                            name="role"
                            value={user.role}
                            onChange={handleChange}
                            required
                            className="input-field"
                        >

                            <option value="">
                                Select Role
                            </option>

                            <option value="admin">
                                Admin
                            </option>

                            <option value="supervisor">
                                Supervisor
                            </option>

                            <option value="staff">
                                Staff
                            </option>

                            <option value="storekeeper">
                                StoreKeeper
                            </option>

                        </select>

                    </div>


                    {/* BUTTONS */}

                    <div className="flex gap-2 md:col-span-2 pt-2">

                        <button
                            type="submit"
                            className="btn-primary"
                        >

                            {editingId
                                ? "Update User"
                                : "Add User"
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
                USERS TABLE
            ===================================== */}

            <div className="card p-4">

                <h3 className="section-heading mb-4 px-2">
                    Users
                </h3>


                {loading ? (

                    <p className="p-4 text-gray-500">
                        Loading users...
                    </p>

                ) : (

                    <DataTable
                        customStyles={dataTableCustomStyles}
                        columns={columns}
                        data={filteredUsers}
                        pagination
                        highlightOnHover
                        noDataComponent={
                            <div className="p-4 text-gray-500">
                                No users found
                            </div>
                        }
                    />

                )}

            </div>

        </div>
    );
}

export default Users;