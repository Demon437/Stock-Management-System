
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { dataTableCustomStyles } from "../../constants/tableStyles";

const API_URL = import.meta.env.VITE_API_URL;

const inputClass =
    "px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition";

function PurchaseOrders() {

    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    const [supplier, setSupplier] = useState("");

    const [items, setItems] = useState([
        {
            product: "",
            quantity: 1,
            unitPrice: 0
        }
    ]);


    // =====================================================
    // CURRENT USER
    // =====================================================

    const getCurrentUserId = () => {

        try {

            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            const user = JSON.parse(storedUser);

            return (
                user?._id ||
                user?.id ||
                user?.userId ||
                user?.user?._id ||
                user?.user?.id ||
                null
            );

        } catch (error) {

            console.error("USER PARSE ERROR:", error);

            return null;
        }

    };


    // =====================================================
    // LOAD PURCHASE ORDERS
    // =====================================================

    const loadPurchaseOrders = async () => {

        try {

            const response = await axios.get(
                `${API_URL}/api/purchase-orders`
            );

            if (response.data?.success) {

                setPurchaseOrders(
                    response.data.purchaseOrders || []
                );

            } else {

                setPurchaseOrders([]);

            }

        } catch (error) {

            console.error(
                "LOAD PURCHASE ORDERS ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load purchase orders"
            );

        }

    };


    // =====================================================
    // LOAD SUPPLIERS
    // =====================================================

    const loadSuppliers = async () => {

        try {

            const response = await axios.get(
                `${API_URL}/api/supplier`
            );

            if (response.data?.success) {

                setSuppliers(
                    response.data.suppliers || []
                );

            } else {

                setSuppliers([]);

            }

        } catch (error) {

            console.error(
                "LOAD SUPPLIERS ERROR:",
                error
            );

        }

    };


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    const loadProducts = async () => {

        try {

            const response = await axios.get(
                `${API_URL}/api/product`
            );

            if (response.data?.success) {

                setProducts(
                    response.data.products || []
                );

            } else {

                setProducts([]);

            }

        } catch (error) {

            console.error(
                "LOAD PRODUCTS ERROR:",
                error
            );

        }

    };


    // =====================================================
    // LOAD ALL DATA
    // =====================================================

    const loadData = async () => {

        setLoading(true);

        try {

            await Promise.all([
                loadPurchaseOrders(),
                loadSuppliers(),
                loadProducts()
            ]);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadData();

    }, []);


    // =====================================================
    // ITEM CHANGE
    // =====================================================

    const handleItemChange = (
        index,
        field,
        value
    ) => {

        setItems(currentItems => {

            const updatedItems = [...currentItems];

            updatedItems[index] = {
                ...updatedItems[index],
                [field]: value
            };

            if (field === "product") {

                const selectedProduct = products.find(
                    product =>
                        String(product._id) ===
                        String(value)
                );

                if (selectedProduct) {

                    updatedItems[index].unitPrice =
                        Number(
                            selectedProduct.product_price || 0
                        );

                }

            }

            return updatedItems;

        });

    };


    // =====================================================
    // ADD ITEM
    // =====================================================

    const addItem = () => {

        setItems(currentItems => [

            ...currentItems,

            {
                product: "",
                quantity: 1,
                unitPrice: 0
            }

        ]);

    };


    // =====================================================
    // REMOVE ITEM
    // =====================================================

    const removeItem = (index) => {

        setItems(currentItems => {

            if (currentItems.length === 1) {
                return currentItems;
            }

            return currentItems.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            );

        });

    };


    // =====================================================
    // TOTAL
    // =====================================================

    const totalAmount = items.reduce(
        (total, item) =>
            total +
            Number(item.quantity || 0) *
            Number(item.unitPrice || 0),
        0
    );


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setSupplier("");

        setItems([
            {
                product: "",
                quantity: 1,
                unitPrice: 0
            }
        ]);

    };


    // =====================================================
    // CREATE PURCHASE ORDER
    // =====================================================

    const handleCreate = async (event) => {

        event.preventDefault();

        const userId = getCurrentUserId();

        if (!userId) {

            alert(
                "User ID not found. Please login again."
            );

            return;

        }

        if (!supplier) {

            alert(
                "Please select a supplier."
            );

            return;

        }

        for (const item of items) {

            if (!item.product) {

                alert(
                    "Please select a product."
                );

                return;

            }

            if (
                !item.quantity ||
                Number(item.quantity) < 1
            ) {

                alert(
                    "Quantity must be at least 1."
                );

                return;

            }

            if (
                item.unitPrice === "" ||
                Number(item.unitPrice) < 0
            ) {

                alert(
                    "Please enter a valid unit price."
                );

                return;

            }

        }

        const requestData = {

            supplier,

            createdBy: userId,

            items: items.map(item => ({

                product: item.product,

                quantity:
                    Number(item.quantity),

                unitPrice:
                    Number(item.unitPrice)

            }))

        };

        try {

            setCreating(true);

            const response = await axios.post(
                `${API_URL}/api/purchase-orders/create`,
                requestData
            );

            if (response.data?.success) {

                alert(
                    response.data.message ||
                    "Purchase order created successfully"
                );

                resetForm();

                await loadPurchaseOrders();

            } else {

                alert(
                    response.data?.message ||
                    "Failed to create purchase order"
                );

            }

        } catch (error) {

            console.error(
                "CREATE PURCHASE ORDER ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.message ||
                "Failed to create purchase order"
            );

        } finally {

            setCreating(false);

        }

    };


    // =====================================================
    // APPROVE PURCHASE ORDER
    // =====================================================

    const handleApprove = async (id) => {

        if (!id) {

            alert(
                "Purchase Order ID is missing."
            );

            return;

        }

        const userId = getCurrentUserId();

        if (!userId) {

            alert(
                "User ID not found. Please login again."
            );

            return;

        }

        try {

            setProcessingId(id);

            const response = await axios.put(
                `${API_URL}/api/purchase-orders/approve/${id}`,
                {
                    userId
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data?.success) {

                alert(
                    response.data.message ||
                    "Purchase order approved successfully."
                );

                await loadPurchaseOrders();

            } else {

                alert(
                    response.data?.message ||
                    "Approval failed."
                );

            }

        } catch (error) {

            console.error(
                "APPROVE PURCHASE ORDER ERROR:",
                error
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


    // =====================================================
    // REJECT PURCHASE ORDER
    // =====================================================

    const handleReject = async (id) => {

        console.log("REJECT BUTTON CLICKED:", id);

        if (!id) {
            alert("Purchase Order ID is missing.");
            return;
        }

        const userId = getCurrentUserId();

        console.log("USER ID:", userId);

        if (!userId) {
            alert("User ID not found. Please login again.");
            return;
        }

        try {

            setProcessingId(id);

            const response = await axios.put(
                `${API_URL}/api/purchase-orders/reject/${id}`,
                {
                    userId: userId
                }
            );

            console.log("REJECT RESPONSE:", response.data);

            if (response.data?.success) {

                alert(
                    response.data.message ||
                    "Purchase order rejected successfully."
                );

                await loadPurchaseOrders();

            } else {

                alert(
                    response.data?.message ||
                    "Rejection failed."
                );

            }

        } catch (error) {

            console.error("REJECT ERROR:", error);
            console.error("STATUS:", error.response?.status);
            console.error("SERVER:", error.response?.data);

            alert(
                error.response?.data?.message ||
                error.message ||
                "Rejection failed."
            );

        } finally {

            setProcessingId(null);

        }

    };


    // =====================================================
    // STATUS
    // =====================================================

    const statusClass = (status) => {

        if (status === "Approved") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Rejected") {
            return "bg-red-100 text-red-700";
        }

        return "bg-yellow-100 text-yellow-700";

    };


    // =====================================================
    // TABLE COLUMNS
    // =====================================================

    const columns = [

        {
            name: "PO Number",
            selector: row => row.poNumber || "-",
            sortable: true,
            width: "125px"
        },

        {
            name: "Supplier",
            selector: row =>
                row.supplier?.company_name ||
                row.supplier?.supplier_name ||
                "N/A",
            sortable: true,
            grow: 1.5
        },

        {
            name: "Products",

            selector: row =>
                row.items?.length
                    ? row.items
                        .map(
                            item =>
                                `${item.product?.product_name || "Unknown Product"} × ${item.quantity}`
                        )
                        .join(", ")
                    : "No items",

            sortable: false,

            grow: 2.5,

            cell: row => (

                row.items?.length ? (

                    <div className="py-2 space-y-1">

                        {row.items.map((item, index) => (

                            <div key={index} className="text-sm">

                                <span className="font-medium text-gray-800">
                                    {item.product?.product_name ||
                                        "Unknown Product"}
                                </span>

                                <span className="text-gray-500">
                                    {" × "}
                                    {item.quantity}
                                </span>

                            </div>

                        ))}

                    </div>

                ) : (

                    <span className="text-gray-500">
                        No items
                    </span>

                )

            )
        },

        {
            name: "Total",

            selector: row =>
                Number(row.totalAmount || 0),

            sortable: true,

            width: "125px",

            cell: row => (

                <span className="font-semibold text-gray-800">

                    Rs.{" "}

                    {Number(
                        row.totalAmount || 0
                    ).toLocaleString("en-LK")}

                </span>

            )
        },

        {
            name: "Status",

            selector: row =>
                row.status || "Pending",

            sortable: true,

            width: "105px",

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
            name: "Created By",

            selector: row =>
                row.createdBy?.name || "N/A",

            sortable: true,

            grow: 1
        },

        {
            name: "Actions",

            cell: row => {

                const poId = row._id;

                const processing =
                    processingId === poId;

                return (

                    row.status === "Pending" ? (

                        <div className="flex w-full items-center justify-center gap-1 whitespace-nowrap">

                            <button
                                type="button"
                                disabled={processing}
                                onClick={() =>
                                    handleApprove(
                                        poId
                                    )
                                }
                                className="bg-green-500 hover:bg-green-700 btn-edit !px-2 !py-1 text-xs whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing
                                    ? "Processing..."
                                    : "Approve"}
                            </button>

                            <button
                                type="button"
                                disabled={processing}
                                onClick={() =>
                                    handleReject(
                                        poId
                                    )
                                }
                                className="btn-delete !px-2 !py-1 text-xs whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing
                                    ? "Processing..."
                                    : "Reject"}
                            </button>

                        </div>

                    ) : (

                        <span className="text-gray-400 text-sm">
                            Completed
                        </span>

                    )

                );

            },

            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "175px"
        }

    ];


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="page-bg">


            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="page-header">

                <div>

                    <h1 className="page-heading">
                        Purchase Orders
                    </h1>

                    <p className="text-gray-600 mt-1">
                        Create, approve and manage purchase orders.
                    </p>

                </div>

            </div>


            {/* =====================================
                CREATE PURCHASE ORDER
            ===================================== */}

            <div className="card-padded mb-6">

                <h2 className="section-heading mb-5">
                    Create Purchase Order
                </h2>

                <form
                    onSubmit={handleCreate}
                    className="space-y-5"
                >


                    {/* SUPPLIER */}

                    <div className="max-w-lg">

                        <label className="input-label">
                            Supplier
                        </label>

                        <select
                            value={supplier}
                            onChange={(event) =>
                                setSupplier(
                                    event.target.value
                                )
                            }
                            className={`w-full ${inputClass}`}
                        >

                            <option value="">
                                Select Supplier
                            </option>

                            {suppliers
                                .filter(
                                    item =>
                                        item.status === "Active"
                                )
                                .map(item => (

                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.company_name}
                                        {" - "}
                                        {item.supplier_name}
                                    </option>

                                ))}

                        </select>

                    </div>


                    {/* PRODUCTS */}

                    <div>

                        <div className="flex items-center justify-between mb-3">

                            <h3 className="text-lg font-bold text-[#0F172A]">
                                Products
                            </h3>

                            <button
                                type="button"
                                onClick={addItem}
                                className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
                            >
                                + Add Product
                            </button>

                        </div>


                        <div className="space-y-3">

                            {items.map((item, index) => (

                                <div
                                    key={index}
                                    className="p-4 bg-gray-50 border border-gray-200 rounded-xl"
                                >

                                    <div className="flex flex-wrap items-end gap-3">


                                        {/* PRODUCT */}

                                        <div className="flex-1 min-w-[220px]">

                                            <label className="input-label">
                                                Product
                                            </label>

                                            <select
                                                value={item.product}
                                                onChange={(event) =>
                                                    handleItemChange(
                                                        index,
                                                        "product",
                                                        event.target.value
                                                    )
                                                }
                                                className={`w-full ${inputClass}`}
                                            >

                                                <option value="">
                                                    Select Product
                                                </option>

                                                {products.map(product => (

                                                    <option
                                                        key={product._id}
                                                        value={product._id}
                                                    >
                                                        {product.product_name}
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
                                                min="1"
                                                value={item.quantity}
                                                onChange={(event) =>
                                                    handleItemChange(
                                                        index,
                                                        "quantity",
                                                        event.target.value
                                                    )
                                                }
                                                className={`${inputClass} w-32`}
                                            />

                                        </div>


                                        {/* PRICE */}

                                        <div>

                                            <label className="input-label">
                                                Unit Price
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.unitPrice}
                                                onChange={(event) =>
                                                    handleItemChange(
                                                        index,
                                                        "unitPrice",
                                                        event.target.value
                                                    )
                                                }
                                                className={`${inputClass} w-36`}
                                            />

                                        </div>


                                        {/* REMOVE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeItem(index)
                                            }
                                            disabled={
                                                items.length === 1
                                            }
                                            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* TOTAL */}

                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Order Total
                            </p>

                            <p className="text-2xl font-bold text-[#0F172A]">

                                Rs.{" "}

                                {totalAmount.toLocaleString(
                                    "en-LK"
                                )}

                            </p>

                        </div>

                        <button
                            type="submit"
                            disabled={creating}
                            className="bg-[#0F172A] hover:bg-[#1E293B] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
                        >
                            {creating
                                ? "Creating..."
                                : "Create Purchase Order"}
                        </button>

                    </div>

                </form>

            </div>


            {/* =====================================
                PURCHASE ORDER HISTORY
            ===================================== */}

            <div className="card p-4">


                {/* TABLE HEADER */}

                <div className="flex items-center justify-between px-2 mb-4">

                    <div>

                        <h2 className="section-heading">
                            Purchase Order History
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage pending purchase orders.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={loadPurchaseOrders}
                        disabled={loading}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Loading..."
                            : "Refresh"}
                    </button>

                </div>


                {/* DATA TABLE */}

                {loading ? (

                    <div className="p-8 text-center text-gray-500">
                        Loading purchase orders...
                    </div>

                ) : (

                    <DataTable
                        customStyles={dataTableCustomStyles}
                        columns={columns}
                        data={purchaseOrders}
                        pagination
                        highlightOnHover
                        responsive
                        noDataComponent={
                            <div className="p-4 text-gray-500">
                                No purchase orders found
                            </div>
                        }
                    />

                )}

            </div>

        </div>

    );

}

export default PurchaseOrders;

