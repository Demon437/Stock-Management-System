
import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { dataTableCustomStyles } from "../../constants/tableStyles";

function ApprovalsDisplay() {

    const [requests, setRequests] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);


    // ==========================================
    // API URL
    // ==========================================

    const API_URL = import.meta.env.VITE_API_URL;


    // ==========================================
    // GET CURRENT USER ID
    // ==========================================

    const getCurrentUserId = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            console.log(
                "LOCAL STORAGE USER:",
                storedUser
            );

            if (!storedUser) {
                return null;
            }

            const user =
                JSON.parse(storedUser);

            console.log(
                "PARSED USER:",
                user
            );

            const userId =
                user?._id ||
                user?.id ||
                user?.userId ||
                user?.user?._id ||
                user?.user?.id ||
                null;

            console.log(
                "USER ID BEING SENT:",
                userId
            );

            return userId;

        } catch (error) {

            console.error(
                "USER PARSE ERROR:",
                error
            );

            return null;
        }
    };


    // ==========================================
    // FETCH REQUESTS
    // ==========================================

    const fetchRequests = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/api/requests`
            );

            console.log(
                "REQUESTS RESPONSE:",
                response.data
            );

            const data =
                response.data?.requests || [];

            const formatted = data.map(
                (req, index) => ({

                    _id: req._id,

                    sno: index + 1,

                    product_name:
                        req.product?.product_name ||
                        "-",

                    requested_by:
                        req.requestedBy?.name ||
                        "-",

                    quantity:
                        req.quantity,

                    status:
                        req.status,

                    handled_by:
                        req.handledBy?.name ||
                        "-"

                })
            );

            setRequests(formatted);

        } catch (error) {

            console.error(
                "GET REQUESTS ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "SERVER DATA:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to load requests"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        fetchRequests();

    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    useEffect(() => {

        const searchValue =
            search.toLowerCase().trim();

        const result =
            requests.filter((item) => {

                return (

                    item.product_name
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    item.requested_by
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    item.status
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    item.handled_by
                        ?.toLowerCase()
                        .includes(searchValue)

                );

            });

        setFilteredRequests(result);

    }, [search, requests]);


    // ==========================================
    // SEARCH INPUT
    // ==========================================

    const handleSearch = (event) => {

        setSearch(
            event.target.value
        );

    };


    // ==========================================
    // APPROVE REQUEST
    // ==========================================

    const approveRequest = async (id) => {

        console.log(
            "APPROVE BUTTON CLICKED:",
            id
        );


        if (!id) {

            alert(
                "Request ID is missing."
            );

            return;
        }


        const userId =
            getCurrentUserId();


        if (!userId) {

            alert(
                "User ID not found. Please login again."
            );

            return;
        }


        // IMPORTANT:
        // User must actually click OK.

        const confirmed =
            window.confirm(
                "Are you sure you want to approve this request?"
            );


        console.log(
            "APPROVAL CONFIRM RESULT:",
            confirmed
        );


        if (!confirmed) {

            console.log(
                "APPROVAL CANCELLED BY USER"
            );

            return;
        }


        try {

            setProcessingId(id);


            const url =
                `${API_URL}/api/requests/approve/${id}`;


            console.log(
                "APPROVE URL:",
                url
            );


            console.log(
                "APPROVE USER ID:",
                userId
            );


            const response =
                await axios.put(

                    url,

                    {
                        userId: userId
                    },

                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }

                );


            console.log(
                "APPROVE STATUS:",
                response.status
            );


            console.log(
                "APPROVE RESPONSE:",
                response.data
            );


            if (response.data?.success === false) {

                alert(
                    response.data?.message ||
                    "Approval failed."
                );

                return;
            }


            alert(
                response.data?.message ||
                "Request approved successfully."
            );


            await fetchRequests();


        } catch (error) {

            console.error(
                "========== APPROVE ERROR =========="
            );

            console.error(
                "ERROR:",
                error
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "SERVER:",
                error.response?.data
            );

            console.error(
                "URL:",
                error.config?.url
            );


            alert(

                error.response?.data?.message ||

                error.message ||

                "Approval failed."

            );

        } finally {

            setProcessingId(null);

        }

    };


    // ==========================================
    // REJECT REQUEST
    // ==========================================

    const rejectRequest = async (id) => {

        console.log(
            "REJECT BUTTON CLICKED:",
            id
        );


        if (!id) {

            alert(
                "Request ID is missing."
            );

            return;
        }


        const userId =
            getCurrentUserId();


        if (!userId) {

            alert(
                "User ID not found. Please login again."
            );

            return;
        }


        // IMPORTANT:
        // User must actually click OK.

        const confirmed =
            window.confirm(
                "Are you sure you want to reject this request?"
            );


        console.log(
            "REJECTION CONFIRM RESULT:",
            confirmed
        );


        if (!confirmed) {

            console.log(
                "REJECTION CANCELLED BY USER"
            );

            return;
        }


        try {

            setProcessingId(id);


            const url =
                `${API_URL}/api/requests/reject/${id}`;


            console.log(
                "REJECT URL:",
                url
            );


            console.log(
                "REJECT USER ID:",
                userId
            );


            const response =
                await axios.put(

                    url,

                    {
                        userId: userId
                    },

                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }

                );


            console.log(
                "REJECT STATUS:",
                response.status
            );


            console.log(
                "REJECT RESPONSE:",
                response.data
            );


            if (response.data?.success === false) {

                alert(
                    response.data?.message ||
                    "Rejection failed."
                );

                return;
            }


            alert(
                response.data?.message ||
                "Request rejected successfully."
            );


            await fetchRequests();


        } catch (error) {

            console.error(
                "========== REJECT ERROR =========="
            );

            console.error(
                "ERROR:",
                error
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "SERVER:",
                error.response?.data
            );

            console.error(
                "URL:",
                error.config?.url
            );


            alert(

                error.response?.data?.message ||

                error.message ||

                "Rejection failed."

            );

        } finally {

            setProcessingId(null);

        }

    };


    // ==========================================
    // TABLE COLUMNS
    // ==========================================

    const columns = [

        {
            name: "S.No",

            selector: row =>
                row.sno,

            sortable: true,

            width: "80px"
        },


        {
            name: "Product",

            selector: row =>
                row.product_name,

            sortable: true,

            width: "220px"
        },


        {
            name: "Requested By",

            selector: row =>
                row.requested_by,

            sortable: true,

            width: "190px"
        },


        {
            name: "Quantity",

            selector: row =>
                row.quantity,

            sortable: true,

            width: "120px",

            center: true,

            cell: row => (

                <span className="font-semibold text-gray-800">

                    {row.quantity}

                </span>

            )

        },


        {
            name: "Status",

            selector: row =>
                row.status,

            sortable: true,

            width: "160px",

            cell: row => (

                <span
                    className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-semibold
                        ${
                            row.status === "Pending"

                                ? "bg-yellow-100 text-yellow-700"

                                : row.status === "Approved"

                                ? "bg-green-100 text-green-700"

                                : "bg-red-100 text-red-700"
                        }
                    `}
                >

                    {row.status || "Pending"}

                </span>

            )

        },


        {
            name: "Handled By",

            selector: row =>
                row.handled_by,

            sortable: true,

            width: "190px"
        },


        // ======================================
        // ACTIONS
        // ======================================

        {
            name: "Actions",

            width: "240px",

            cell: row => {

                const processing =
                    processingId === row._id;


                if (
                    row.status !==
                    "Pending"
                ) {

                    return (

                        <span className="text-gray-400 text-sm">

                            Completed

                        </span>

                    );

                }


                return (

                    <div className="flex items-center gap-2">

                        <button
                            type="button"
                            disabled={processing}
                            onClick={() =>
                                approveRequest(
                                    row._id
                                )
                            }
                            className="
                                bg-green-500
                                hover:bg-green-600
                                disabled:bg-gray-400
                                disabled:cursor-not-allowed
                                text-white
                                px-3
                                py-1.5
                                rounded-lg
                                text-sm
                                font-semibold
                                transition
                                cursor-pointer
                            "
                        >

                            {processing
                                ? "Processing..."
                                : "Approve"}

                        </button>


                        <button
                            type="button"
                            disabled={processing}
                            onClick={() =>
                                rejectRequest(
                                    row._id
                                )
                            }
                            className="
                                bg-red-500
                                hover:bg-red-600
                                disabled:bg-gray-400
                                disabled:cursor-not-allowed
                                text-white
                                px-3
                                py-1.5
                                rounded-lg
                                text-sm
                                font-semibold
                                transition
                                cursor-pointer
                            "
                        >

                            {processing
                                ? "Processing..."
                                : "Reject"}

                        </button>

                    </div>

                );

            },

            ignoreRowClick: true,

            allowOverflow: true,

            button: true
        }

    ];


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div
            className="
                p-6
                bg-gradient-to-br
                from-[#F8FAFC]
                via-[#E0F2FE]
                to-[#BAE6FD]
                min-h-screen
                text-gray-900
            "
        >


            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div
                className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    justify-between
                    gap-4
                    mb-6
                "
            >

                <div>

                    <h2
                        className="
                            text-3xl
                            font-bold
                            text-[#0F172A]
                        "
                    >

                        Approvals Overview

                    </h2>

                    <p className="text-gray-600 mt-1">

                        Review, approve and reject requests.

                    </p>

                </div>


                {/* SEARCH */}

                <div
                    className="
                        relative
                        w-full
                        md:w-80
                    "
                >

                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search requests..."
                        className="
                            w-full
                            px-4
                            py-2
                            pl-10
                            rounded-xl
                            border
                            border-gray-300
                            bg-white
                            shadow-sm
                            text-gray-900
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-400
                            transition
                        "
                    />


                    <svg
                        className="
                            w-5
                            h-5
                            text-gray-400
                            absolute
                            left-3
                            top-2.5
                        "
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >

                        <path
                            d="
                                M21 21
                                l-4.35-4.35
                                M10.5 18
                                a7.5 7.5 0 1 1
                                0-15
                                7.5 7.5 0 0 1
                                0 15z
                            "
                        />

                    </svg>

                </div>

            </div>


            {/* =====================================
                REQUEST TABLE
            ===================================== */}

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow-md
                    p-4
                "
            >

                <h3
                    className="
                        text-xl
                        font-bold
                        text-[#0F172A]
                        mb-4
                        px-2
                    "
                >

                    Approval Requests

                </h3>


                {loading ? (

                    <div className="p-8 text-center text-gray-500">

                        Loading requests...

                    </div>

                ) : (

                    <DataTable
                        customStyles={dataTableCustomStyles}
                        columns={columns}
                        data={filteredRequests}
                        pagination
                        highlightOnHover
                        responsive
                        persistTableHead
                        noDataComponent={

                            <div className="p-8 text-gray-500">

                                No requests found

                            </div>

                        }
                    />

                )}

            </div>

        </div>

    );

}

export default ApprovalsDisplay;

