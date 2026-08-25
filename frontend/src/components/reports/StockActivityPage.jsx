import { downloadReportPdf } from "./reportPdf";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StockActivityPage = () => {

    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");

    const navigate = useNavigate();


    // ==========================================
    // FETCH STOCK ACTIVITY
    // ==========================================

    useEffect(() => {

        const fetchData = async () => {

            try {

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/reports/activity`
                );

                setData(res.data || []);

            } catch (error) {

                console.error(
                    "GET STOCK ACTIVITY ERROR:",
                    error
                );

            }

        };

        fetchData();

    }, []);


    // ==========================================
    // TYPE BADGE
    // ==========================================

    const getTypeBadge = (type) => {

        switch (type) {

            case "stock":
                return "bg-cyan-100 text-cyan-700";

            case "product":
                return "bg-purple-100 text-purple-700";

            case "request":
                return "bg-cyan-100 text-cyan-700";

            default:
                return "bg-slate-200 text-slate-700";

        }

    };


    // ==========================================
    // FILTER DATA
    // ==========================================

    const filteredData = useMemo(() => {

        const searchValue =
            search.toLowerCase().trim();

        return data.filter((item) => {

            // ==============================
            // SEARCH
            // ==============================

            const matchesSearch =
                !searchValue ||
                item.user
                    ?.toLowerCase()
                    .includes(searchValue) ||

                item.action
                    ?.toLowerCase()
                    .includes(searchValue) ||

                item.type
                    ?.toLowerCase()
                    .includes(searchValue) ||

                item.meta?.productName
                    ?.toLowerCase()
                    .includes(searchValue);


            // ==============================
            // TYPE
            // ==============================

            const matchesType =
                typeFilter === "all" ||
                item.type === typeFilter;


            // ==============================
            // DATE
            // ==============================

            let matchesDate = true;

            if (dateFilter) {

                const activityDate =
                    new Date(item.createdAt)
                        .toISOString()
                        .split("T")[0];

                matchesDate =
                    activityDate === dateFilter;

            }


            return (
                matchesSearch &&
                matchesType &&
                matchesDate
            );

        });

    }, [
        data,
        search,
        typeFilter,
        dateFilter
    ]);


    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFilters = () => {

        setSearch("");
        setTypeFilter("all");
        setDateFilter("");

    };


    // ==========================================
    // PRINT
    // ==========================================

    const handlePrint = () => {
        downloadReportPdf({
            title: "Stock Activity Report",
            subtitle: "Stock In / Out Tracking",
            filename: "stock-activity-report.pdf",
            filters: getFilterText(),
            columns: [
                { label: "S No", value: (row, index) => index + 1 },
                { label: "User", value: (item, index) => item.user || '-' },
                { label: "Product", value: (item, index) => item.meta?.productName || '-' },
                { label: "Qty", value: (item, index) => item.meta?.quantity ?? '-' },
                { label: "Action", value: (item, index) => item.action || '-' },
                { label: "Type", value: (item, index) => item.type || '-' },
                { label: "Date", value: (item, index) => item.createdAt ? new Date(item.createdAt).toLocaleString() : '-' },
            ],
            rows: filteredData ,
        });
    };


    // ==========================================
    // PRINT FILTER TEXT
    // ==========================================

    const getFilterText = () => {

        const filters = [];

        if (search.trim()) {

            filters.push(
                `Search: ${search.trim()}`
            );

        }

        if (typeFilter !== "all") {

            filters.push(
                `Type: ${typeFilter}`
            );

        }

        if (dateFilter) {

            filters.push(
                `Date: ${dateFilter}`
            );

        }

        if (filters.length === 0) {

            return "All activities";

        }

        return filters.join(" | ");

    };


    return (

        <div className="page-bg">

            <div className="page-container">


                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="card-padded mb-6 print:hidden">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                            <h1 className="page-heading">
                                Stock Activity
                            </h1>

                            <p className="page-subheading mb-0">
                                Stock In / Out Tracking
                            </p>

                        </div>


                        <div className="flex gap-2">

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn-back"
                            >
                                Back
                            </button>


                            <button
                                type="button"
                                onClick={handlePrint}
                                className="btn-primary"
                            >
                                Print
                            </button>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    FILTERS
                ===================================== */}

                <div className="card-padded mb-6 print:hidden">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


                        {/* SEARCH */}

                        <div className="md:col-span-2">

                            <label className="input-label">
                                Search
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search user, product or action..."
                                className="search-input w-full"
                            />

                        </div>


                        {/* TYPE */}

                        <div>

                            <label className="input-label">
                                Activity Type
                            </label>

                            <select
                                value={typeFilter}
                                onChange={(e) =>
                                    setTypeFilter(
                                        e.target.value
                                    )
                                }
                                className="input-field w-full"
                            >

                                <option value="all">
                                    All Activities
                                </option>

                                <option value="stock">
                                    Stock
                                </option>

                                <option value="product">
                                    Product
                                </option>

                                <option value="request">
                                    Request
                                </option>

                            </select>

                        </div>


                        {/* DATE */}

                        <div>

                            <label className="input-label">
                                Date
                            </label>

                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) =>
                                    setDateFilter(
                                        e.target.value
                                    )
                                }
                                className="input-field w-full"
                            />

                        </div>

                    </div>


                    {/* FILTER FOOTER */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">

                        <p className="text-sm text-gray-500">

                            Showing{" "}

                            <span className="font-semibold text-gray-700">
                                {filteredData.length}
                            </span>

                            {" "}of{" "}

                            <span className="font-semibold text-gray-700">
                                {data.length}
                            </span>

                            {" "}activities

                        </p>


                        <button
                            type="button"
                            onClick={clearFilters}
                            className="btn-secondary"
                        >
                            Clear Filters
                        </button>

                    </div>

                </div>


                {/* =====================================
                    PRINTABLE REPORT
                ===================================== */}

                <div
                    id="print-area"
                    className="card overflow-hidden"
                >


                    {/* =================================
                        PRINT HEADER
                    ================================= */}

                    <div className="hidden print:block p-6 border-b border-gray-300">

                        <div className="flex justify-between items-start">

                            <div>

                                <h1 className="text-2xl font-bold text-slate-900">
                                    Stock Activity Report
                                </h1>

                                <p className="text-sm text-slate-600 mt-1">
                                    Stock In / Out Tracking
                                </p>

                            </div>


                            <div className="text-right text-sm text-slate-600">

                                <p>
                                    Generated:
                                </p>

                                <p className="font-medium text-slate-900">
                                    {new Date().toLocaleString()}
                                </p>

                            </div>

                        </div>


                        {/* FILTER SUMMARY */}

                        <div className="mt-4 pt-3 border-t border-gray-200">

                            <p className="text-sm text-slate-600">

                                <span className="font-semibold text-slate-800">
                                    Filters:
                                </span>{" "}

                                {getFilterText()}

                            </p>


                            <p className="text-sm text-slate-600 mt-1">

                                <span className="font-semibold text-slate-800">
                                    Records:
                                </span>{" "}

                                {filteredData.length}

                            </p>

                        </div>

                    </div>


                    {/* =================================
                        TABLE
                    ================================= */}

                    <div className="overflow-x-auto">

                        <table className="report-table w-full">

                            <thead>

                                <tr>

                                    <th className="p-4 text-left font-semibold text-slate-700 w-20">
                                        S No
                                    </th>

                                    <th className="p-4 text-left font-semibold text-slate-700">
                                        User
                                    </th>

                                    <th className="p-4 text-left font-semibold text-slate-700">
                                        Product
                                    </th>

                                    <th className="p-4 text-left font-semibold text-slate-700">
                                        Qty
                                    </th>

                                    <th className="p-4 text-left font-semibold text-slate-700">
                                        Action
                                    </th>

                                    <th className="p-4 text-left font-semibold text-slate-700">
                                        Type
                                    </th>

                                    <th className="p-4 text-left font-semibold text-slate-700">
                                        Date
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredData.length > 0 ? (

                                    filteredData.map(
                                        (item, index) => (

                                            <tr
                                                key={item._id}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition"
                                            >

                                                {/* S NO */}

                                                <td className="p-4 font-medium text-slate-600">
                                                    {index + 1}
                                                </td>


                                                {/* USER */}

                                                <td className="p-4 text-slate-800 font-medium">
                                                    {item.user || "-"}
                                                </td>


                                                {/* PRODUCT */}

                                                <td className="p-4 text-slate-800">
                                                    {item.meta?.productName || "-"}
                                                </td>


                                                {/* QUANTITY */}

                                                <td className="p-4 text-slate-800 font-semibold">
                                                    {item.meta?.quantity ?? "-"}
                                                </td>


                                                {/* ACTION */}

                                                <td className="p-4 text-slate-800">
                                                    {item.action || "-"}
                                                </td>


                                                {/* TYPE */}

                                                <td className="p-4">

                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadge(
                                                            item.type
                                                        )}`}
                                                    >
                                                        {item.type || "-"}
                                                    </span>

                                                </td>


                                                {/* DATE */}

                                                <td className="p-4 text-slate-600">

                                                    {item.createdAt
                                                        ? new Date(
                                                            item.createdAt
                                                        ).toLocaleString()
                                                        : "-"
                                                    }

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="p-8 text-center text-gray-500"
                                        >
                                            No stock activity found.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* =================================
                        PRINT FOOTER
                    ================================= */}

                    <div className="hidden print:flex print:justify-between print:items-center p-4 border-t border-gray-300 text-xs text-slate-500">

                        <span>
                            Stock Activity Report
                        </span>

                        <span>
                            Total Records: {filteredData.length}
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================
                PRINT CSS
            ===================================== */}

            <style>
                {`

                    @media print {

                        @page {
                            size: A4 landscape;
                            margin: 12mm;
                        }


                        html,
                        body {
                            background: white !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }


                        body * {
                            visibility: hidden;
                        }


                        #print-area,
                        #print-area * {
                            visibility: visible;
                        }


                        #print-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            background: white !important;
                            border: none !important;
                            box-shadow: none !important;
                            border-radius: 0 !important;
                            overflow: visible !important;
                        }


                        #print-area table {
                            width: 100% !important;
                            border-collapse: collapse !important;
                        }


                        #print-area th {
                            background: #f1f5f9 !important;
                            color: #111827 !important;
                            border: 1px solid #d1d5db !important;
                            padding: 8px !important;
                            font-size: 10px !important;
                        }


                        #print-area td {
                            color: #111827 !important;
                            border: 1px solid #e5e7eb !important;
                            padding: 8px !important;
                            font-size: 9px !important;
                        }


                        #print-area tr {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }


                        #print-area .bg-cyan-100 {
                            background: white !important;
                            color: #0e7490 !important;
                        }


                        #print-area .bg-purple-100 {
                            background: white !important;
                            color: #7e22ce !important;
                        }


                        #print-area .bg-slate-200 {
                            background: white !important;
                            color: #334155 !important;
                        }


                        #print-area .rounded-full {
                            border-radius: 0 !important;
                            padding: 0 !important;
                            font-weight: 600 !important;
                        }


                        #print-area .hidden.print\\:block {
                            display: block !important;
                        }


                        #print-area .hidden.print\\:flex {
                            display: flex !important;
                        }

                    }

                `}
            </style>

        </div>

    );

};

export default StockActivityPage;