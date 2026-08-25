
import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { dataTableCustomStyles } from "../../constants/tableStyles";
import { FaSearch, FaArrowLeft } from "react-icons/fa";

function RequestPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Selected product for request
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/product`
      );

      const data = response.data.products || [];

      const formatted = data.map((product, index) => ({
        _id: product._id,
        sno: index + 1,
        product_name: product.product_name,
        product_price: product.product_price,
        product_quantity: product.product_quantity,
      }));

      setProducts(formatted);
      setFilteredProducts(formatted);
    } catch (error) {
      console.log(error);
    }
  };

  // Search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();

    setSearch(value);

    const filtered = products.filter((item) =>
      item.product_name.toLowerCase().includes(value)
    );

    setFilteredProducts(filtered);
  };

  // Open request form
  const handleRequest = (row) => {
    setSelectedProduct(row);
    setQuantity("");
  };

  // Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quantity || Number(quantity) <= 0) {
      alert("Enter valid quantity");
      return;
    }

    if (Number(quantity) > selectedProduct.product_quantity) {
      alert("Requested quantity cannot exceed available stock");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/requests/create`,
        {
          product: selectedProduct._id,
          quantity: Number(quantity),
          requestedBy: user?._id,
        }
      );

      alert("Request Sent Successfully");

      // Return to product list
      setSelectedProduct(null);
      setQuantity("");

    } catch (error) {
      console.log(error);
      alert("Error sending request");
    }
  };

  // DataTable columns
  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      width: "80px",
    },
    {
      name: "Product",
      selector: (row) => row.product_name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => `Rs. ${row.product_price}`,
    },
    {
      name: "Available Qty",
      selector: (row) => row.product_quantity,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => handleRequest(row)}
          className="bg-cyan-400 hover:bg-cyan-500 cursor-pointer text-black font-semibold px-4 py-2 rounded-lg transition"
        >
          Request
        </button>
      ),
    },
  ];

  return (
    <div className="page-bg">

      {/* ================= REQUEST FORM ================= */}
      {selectedProduct ? (
        <div className="max-w-2xl mx-auto">

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
              Request Stock
            </h2>

            {/* Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">
                  Product ID
                </p>

                <p className="font-semibold text-gray-800 break-all">
                  {selectedProduct._id}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">
                  Product Name
                </p>

                <p className="font-semibold text-gray-800">
                  {selectedProduct.product_name}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">
                  Available Stock
                </p>

                <p className="font-semibold text-gray-800">
                  {selectedProduct.product_quantity}
                </p>
              </div>

            </div>

            {/* Request Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Request Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  max={selectedProduct.product_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Maximum available: {selectedProduct.product_quantity}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="submit"
                  className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-3 rounded-xl transition cursor-pointer"
                >
                  Submit Request
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 bg-[#0F172A] hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        </div>
      ) : (

        /* ================= PRODUCT LIST ================= */
        <div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <h2 className="page-heading">
              Product Requests
              </h2>

              <p className="text-gray-600 mt-1">
                Select a product to request stock
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search product..."
                className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            </div>

          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">

            <DataTable
                        customStyles={dataTableCustomStyles}
              columns={columns}
              data={filteredProducts}
              pagination
              highlightOnHover
              responsive
              persistTableHead
            />

          </div>

        </div>
      )}

    </div>
  );
}

export default RequestPage;

