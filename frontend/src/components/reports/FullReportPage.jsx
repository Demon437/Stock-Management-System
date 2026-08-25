import { downloadReportPdf } from "./reportPdf";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FullReportPage = () => {

    const [summary, setSummary] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalStock: 0,
        lowStock: 0,
    });

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();


    // ==========================================
    // FETCH SUMMARY
    // ==========================================

    useEffect(() => {

        const fetchSummary = async () => {

            try {

                setLoading(true);

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/reports/dashboard`
                );

                setSummary({
                    totalProducts:
                        res.data?.totalProducts || 0,

                    totalUsers:
                        res.data?.totalUsers || 0,

                    totalStock:
                        res.data?.totalStock || 0,

                    lowStock:
                        res.data?.lowStock || 0,
                });

            } catch (error) {

                console.error(
                    "Dashboard fetch error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchSummary();

    }, []);


    // ==========================================
    // PRINT
    // ==========================================

    const handlePrint = () => {
        downloadReportPdf({
            title: "Full System Report",
            subtitle: "Complete overview of your inventory system",
            filename: "full-system-report.pdf",
            filters: "All current system statistics",
            columns: [
                { label: "S No", value: (row, index) => index + 1 },
                { label: "Report Item", value: (stat, index) => stat.label },
                { label: "Category", value: (stat, index) => stat.type },
                { label: "Value", value: (stat, index) => stat.value },
            ],
            rows: stats ,
        });
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="page-bg">

                <div className="loading-state min-h-[60vh]">
                    Loading report...
                </div>

            </div>

        );

    }


    // ==========================================
    // REPORT DATA
    // ==========================================

    const stats = [

        {
            id: 1,
            label: "Total Products",
            value: summary.totalProducts,
            type: "Products",
            className: "text-blue-600"
        },

        {
            id: 2,
            label: "Total Users",
            value: summary.totalUsers,
            type: "Users",
            className: "text-cyan-600"
        },

        {
            id: 3,
            label: "Total Stock",
            value: summary.totalStock,
            type: "Stock",
            className: "text-green-600"
        },

        {
            id: 4,
            label: "Low Stock Items",
            value: summary.lowStock,
            type: "Low Stock",
            className: "text-red-600"
        }

    ];


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
                                Full System Report
                            </h1>

                            <p className="page-subheading mb-0">
                                Complete overview of your inventory system
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
                    PRINT AREA
                ===================================== */}

                <div
                    id="print-area"
                    className="card overflow-hidden"
                >


                    {/* =================================
                        PRINT TITLE
                    ================================= */}

                    <div className="hidden print:block p-6 border-b border-gray-300">

                        <div className="flex justify-between items-start">

                            <div>

                                <h1 className="text-2xl font-bold text-slate-900">
                                    Full System Report
                                </h1>

                                <p className="text-sm text-slate-600 mt-1">
                                    Complete overview of your inventory system
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

                    </div>


                    {/* =================================
                        SUMMARY
                    ================================= */}

                    <div className="p-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                            {stats.map((stat) => (

                                <div
                                    key={stat.id}
                                    className="border border-gray-200 rounded-xl p-5 bg-white"
                                >

                                    <p className="text-sm font-medium text-slate-500">
                                        {stat.label}
                                    </p>


                                    <p
                                        className={`text-3xl font-bold mt-2 ${stat.className}`}
                                    >
                                        {stat.value}
                                    </p>


                                    <p className="text-xs text-slate-500 mt-2">
                                        {stat.type}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* =================================
                        TABLE
                    ================================= */}

                    <div className="px-6 pb-6">

                        <div className="rounded-xl overflow-hidden border border-slate-200">

                            <table className="report-table w-full">

                                <thead>

                                    <tr>

                                        <th className="p-4 text-left font-semibold w-20">
                                            S No
                                        </th>

                                        <th className="p-4 text-left font-semibold">
                                            Report Item
                                        </th>

                                        <th className="p-4 text-left font-semibold">
                                            Category
                                        </th>

                                        <th className="p-4 text-left font-semibold">
                                            Value
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {stats.map((stat, index) => (

                                        <tr
                                            key={stat.id}
                                            className="border-b border-gray-100 last:border-b-0"
                                        >

                                            <td className="p-4 font-medium text-slate-600">
                                                {index + 1}
                                            </td>


                                            <td className="p-4 font-medium text-slate-800">
                                                {stat.label}
                                            </td>


                                            <td className="p-4 text-slate-600">
                                                {stat.type}
                                            </td>


                                            <td
                                                className={`p-4 font-bold ${stat.className}`}
                                            >
                                                {stat.value}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* =================================
                        FOOTER
                    ================================= */}

                    <div className="hidden print:flex print:justify-between print:items-center p-4 border-t border-gray-300 text-xs text-slate-500">

                        <span>
                            Full System Report
                        </span>

                        <span>
                            Total Items: {stats.length}
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================
                TABLE + PRINT CSS
            ===================================== */}

            <style>
                {`

                    /* =================================
                       UI TABLE
                       MATCH PRODUCTS TABLE STYLE
                    ================================= */

                    .report-table {
                        width: 100%;
                        border-collapse: separate !important;
                        border-spacing: 0 !important;
                    }


                    /* TABLE HEADER */

                    .report-table thead {
                        background: #0f172a !important;
                    }


                    .report-table thead tr {
                        background: #0f172a !important;
                    }


                    .report-table thead th {
                        background: #0f172a !important;
                        color: #ffffff !important;

                        font-size: 0.875rem !important;
                        font-weight: 600 !important;

                        padding: 1rem !important;

                        border: none !important;
                        border-bottom: 1px solid #1e293b !important;

                        text-align: left;

                        white-space: nowrap;
                    }


                    /* REMOVE INDIVIDUAL TH ROUNDING */

                    .report-table thead th:first-child {
                        border-top-left-radius: 0 !important;
                    }


                    .report-table thead th:last-child {
                        border-top-right-radius: 0 !important;
                    }


                    /* TABLE BODY */

                    .report-table tbody {
                        background: white;
                    }


                    .report-table tbody tr {
                        background: white;
                        transition: background-color 0.2s ease;
                    }


                    .report-table tbody tr:hover {
                        background: #f8fafc;
                    }


                    .report-table tbody td {
                        background: white;
                        border-bottom: 1px solid #f1f5f9;
                    }


                    .report-table tbody tr:last-child td {
                        border-bottom: none;
                    }


                    /* =================================
                       PRINT
                    ================================= */

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
                            border-spacing: 0 !important;
                        }


                        #print-area th {

                            background: #0f172a !important;
                            color: white !important;

                            border: 1px solid #1e293b !important;

                            padding: 8px !important;

                            font-size: 11px !important;
                        }


                        #print-area td {

                            background: white !important;
                            color: #111827 !important;

                            border: 1px solid #e5e7eb !important;

                            padding: 8px !important;

                            font-size: 10px !important;
                        }


                        #print-area tr {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }


                        #print-area .border {
                            border-color: #d1d5db !important;
                        }


                        #print-area .bg-white {
                            background: white !important;
                        }


                        #print-area .hidden.print\\\\:block {
                            display: block !important;
                        }


                        #print-area .hidden.print\\\\:flex {
                            display: flex !important;
                        }

                    }

                `}
            </style>

        </div>

    );

};

export default FullReportPage;
