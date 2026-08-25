import { downloadReportPdf } from "./reportPdf";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LowStockPage = () => {

    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const navigate = useNavigate();


    // ==========================================
    // FETCH LOW STOCK DATA
    // ==========================================

    useEffect(() => {

        const fetchData = async () => {

            try {

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/reports/low-stock`
                );

                setData(res.data || []);

            } catch (error) {

                console.error(
                    "GET LOW STOCK ERROR:",
                    error
                );

            }

        };

        fetchData();

    }, []);


    // ==========================================
    // GET STATUS
    // ==========================================

    const getStatus = (qty) => {

        if (qty === 0) {

            return {
                text: "Out of Stock",
                className: "bg-red-100 text-red-700"
            };

        }

        if (qty < 10) {

            return {
                text: "Low Stock",
                className: "bg-yellow-100 text-yellow-700"
            };

        }

        return {
            text: "In Stock",
            className: "bg-green-100 text-green-700"
        };

    };


    // ==========================================
    // FILTER DATA
    // ==========================================

    const filteredData = useMemo(() => {

        const searchValue =
            search.toLowerCase().trim();

        return data.filter((item) => {

            const qty =
                Number(item.product_quantity || 0);

            const status =
                getStatus(qty).text;

            const matchesSearch =
                !searchValue ||
                item.product_name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                item.product_category
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "all" ||
                status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        data,
        search,
        statusFilter
    ]);


    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFilters = () => {

        setSearch("");
        setStatusFilter("all");

    };


    // ==========================================
    // PRINT
    // ==========================================

    const handlePrint = () => {
        downloadReportPdf({
            title: "Low Stock Report",
            subtitle: "Products requiring stock attention",
            filename: "low-stock-report.pdf",
            filters: getFilterText(),
            columns: [
                { label: "S No", value: (row, index) => index + 1 },
                { label: "Product", value: (item, index) => item.product_name || '-' },
                { label: "Category", value: (item, index) => item.product_category || '-' },
                { label: "Quantity", value: (item, index) => Number(item.product_quantity || 0) },
                { label: "Status", value: (item, index) => getStatus(Number(item.product_quantity || 0)).text },
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

        if (statusFilter !== "all") {

            filters.push(
                `Status: ${statusFilter}`
            );

        }

        if (filters.length === 0) {

            return "All products";

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
                                Low Stock Report
                            </h1>

                            <p className="page-subheading mb-0">
                                Products below threshold level
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


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
                                placeholder="Search product or category..."
                                className="search-input w-full"
                            />

                        </div>


                        {/* STATUS */}

                        <div>

                            <label className="input-label">
                                Stock Status
                            </label>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                                className="input-field w-full"
                            >

                                <option value="all">
                                    All Status
                                </option>

                                <option value="Out of Stock">
                                    Out of Stock
                                </option>

                                <option value="Low Stock">
                                    Low Stock
                                </option>

                                <option value="In Stock">
                                    In Stock
                                </option>

                            </select>

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

                            {" "}products

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
                                    Low Stock Report
                                </h1>

                                <p className="text-sm text-slate-600 mt-1">
                                    Products below threshold level
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
                                        Product
                                    </th>

                                    <th className="p-4 text-left font-semibold text-slate-700">
                                        Category
                                    </th>

                                    <th className="p-4 text-left font-semibold text-slate-700">
                                        Quantity
                                    </th>

                                    <th className="p-4 text-left font-semibold text-slate-700">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredData.length > 0 ? (

                                    filteredData.map(
                                        (item, index) => {

                                            const qty =
                                                Number(
                                                    item.product_quantity || 0
                                                );

                                            const badge =
                                                getStatus(qty);

                                            return (

                                                <tr
                                                    key={item._id}
                                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                                >

                                                    {/* S NO */}

                                                    <td className="p-4 font-medium text-slate-600">
                                                        {index + 1}
                                                    </td>


                                                    {/* PRODUCT */}

                                                    <td className="p-4 text-slate-800 font-medium">
                                                        {item.product_name || "-"}
                                                    </td>


                                                    {/* CATEGORY */}

                                                    <td className="p-4 text-slate-800">
                                                        {item.product_category || "-"}
                                                    </td>


                                                    {/* QUANTITY */}

                                                    <td className="p-4 font-semibold text-slate-800">
                                                        {qty}
                                                    </td>


                                                    {/* STATUS */}

                                                    <td className="p-4">

                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}
                                                        >
                                                            {badge.text}
                                                        </span>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="p-8 text-center text-gray-500"
                                        >
                                            No products found.
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
                            Low Stock Report
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
                            font-size: 11px !important;
                        }


                        #print-area td {
                            color: #111827 !important;
                            border: 1px solid #e5e7eb !important;
                            padding: 8px !important;
                            font-size: 10px !important;
                        }


                        #print-area tr {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }


                        #print-area .bg-green-100 {
                            background: white !important;
                            color: #15803d !important;
                        }


                        #print-area .bg-yellow-100 {
                            background: white !important;
                            color: #ca8a04 !important;
                        }


                        #print-area .bg-red-100 {
                            background: white !important;
                            color: #dc2626 !important;
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

export default LowStockPage;
