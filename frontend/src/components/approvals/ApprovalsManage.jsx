import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { dataTableCustomStyles } from "../../constants/tableStyles";

function ApprovalsManage() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [requests, setRequests] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);


    // ==========================================
    // GET CURRENT USER ID
    // ==========================================

    const getCurrentUserId = () => {

        try {

            const storedUser = localStorage.getItem("user");

            console.log("LOCAL STORAGE USER:", storedUser);

            if (!storedUser) {
                return null;
            }

            const user = JSON.parse(storedUser);

            console.log("PARSED USER:", user);

            const userId =
                user?._id ||
                user?.id ||
                user?.userId ||
                user?.user?._id ||
                user?.user?.id ||
                null;

            console.log("USER ID:", userId);

            return userId;

        } catch (error) {

            console.error("USER PARSE ERROR:", error);

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
                        req.product?.product_name || "-",

                    requested_by:
                        req.requestedBy?.name || "-",

                    quantity:
                        req.quantity,

                    status:
                        req.status,

                    handled_by:
                        req.handledBy?.name || "-"

                })
            );

            setRequests(formatted);
            setFilteredRequests(formatted);

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
                "SERVER:",
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


    useEffect(() => {

        fetchRequests();

    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    useEffect(() => {

        const searchValue =
            search.toLowerCase().trim();

        const result = requests.filter(
            item => {

                return (

                    item.product_name
                        ?.toLowerCase()
                        .includes(searchValue) ||

                    item.requested_by
                        ?.toLowerCase()
                        .includes(searchValue) ||

                    item.status
                        ?.toLowerCase()
                        .includes(searchValue) ||

                    item.handled_by
                        ?.toLowerCase()
                        .includes(searchValue)

                );

            }
        );

        setFilteredRequests(result);

    }, [search, requests]);


    // ==========================================
    // APPROVE REQUEST
    // ==========================================

    const approveRequest = async (id) => {

        console.log(
            "APPROVE REQUEST CLICKED:",
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


        try {

            setProcessingId(id);


            const url =
                `${API_URL}/api/requests/approve/${id}`;


            console.log(
                "APPROVE URL:",
                url
            );

            console.log(
                "SENDING APPROVE REQUEST..."
            );


            const response = await axios.put(

                url,

                {
                    userId: userId
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


            if (response.data?.success) {

                alert(
                    response.data.message ||
                    "Approved successfully"
                );

                await fetchRequests();

            } else {

                alert(
                    response.data?.message ||
                    "Approval failed"
                );

            }

        } catch (error) {

            console.error(
                "APPROVE ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "SERVER:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                error.message ||
                "Approval failed"
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
            "REJECT REQUEST CLICKED:",
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


        try {

            setProcessingId(id);


            const url =
                `${API_URL}/api/requests/reject/${id}`;


            console.log(
                "REJECT URL:",
                url
            );

            console.log(
                "SENDING REJECT REQUEST..."
            );


            const response = await axios.put(

                url,

                {
                    userId: userId
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


            if (response.data?.success) {

                alert(
                    response.data.message ||
                    "Rejected successfully"
                );

                await fetchRequests();

            } else {

                alert(
                    response.data?.message ||
                    "Rejection failed"
                );

            }

        } catch (error) {

            console.error(
                "REJECT ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "SERVER:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                error.message ||
                "Reject failed"
            );

        } finally {

            setProcessingId(null);

        }

    };


    // ==========================================
    // TABLE COLUMNS
    // ==========================================
    const statusClass = (status) => {

        if (status === "Approved") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Rejected") {
            return "bg-red-100 text-red-700";
        }

        return "bg-yellow-100 text-yellow-700";

    };
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

            grow: 1.5
        },


        {
            name: "Requested By",

            selector: row =>
                row.requested_by,

            sortable: true,

            grow: 1.5
        },


        {
            name: "Quantity",

            selector: row =>
                row.quantity,

            sortable: true,

            width: "110px",

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

            width: "130px",

            cell: row => (

                <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                        row.status
                    )}`}
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

            grow: 1.2
        },


        {
            name: "Actions",

            cell: row => {

                const processing =
                    processingId === row._id;


                if (row.status !== "Pending") {

                    return (

                        <span className="text-gray-400 text-sm">
                            -
                        </span>

                    );

                }


                return (

                    <div className="flex items-center justify-center gap-2 w-full">

                        <button
                            type="button"
                            disabled={processing}
                            onClick={() =>
                                approveRequest(
                                    row._id
                                )
                            }
                            className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed hover:shadow-md transition text-white px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer"
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
                            className="bg-red-500 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed hover:shadow-md transition text-white px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer"
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

            button: true,

            width: "220px"
        }

    ];


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="page-bg">


            {/* PAGE HEADER */}

            <div className="page-header">
                <div>
                <h2 className="page-heading">

                    Approval Management

                </h2>
                <p className="text-gray-600 mt-1">
                    View current requests and Approve or Reject
                </p>
                </div>
                {/* SEARCH */}

                <div className="relative w-full md:w-80">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search requests..."
                        className="search-input"
                    />


                    <svg
                        className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >

                        <path
                            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0 15z"
                        />

                    </svg>

                </div>

            </div>


            {/* REQUEST TABLE */}

            <div className="card p-4">

                <h3 className="section-heading mb-4 px-2">

                    Requests

                </h3>


                {loading ? (

                    <p className="p-4 text-gray-500">

                        Loading requests...

                    </p>

                ) : (

                    <DataTable
                        customStyles={dataTableCustomStyles}
                        columns={columns}
                        data={filteredRequests}
                        pagination
                        highlightOnHover
                        responsive
                        noDataComponent={

                            <div className="p-4 text-gray-500">

                                No requests found

                            </div>

                        }
                    />

                )}

            </div>

        </div>

    );

}

export default ApprovalsManage;
