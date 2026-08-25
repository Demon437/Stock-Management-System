import mongoose from "mongoose";

const purchaseOrderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },

        receivedQuantity: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    { _id: false }
);

const purchaseOrderSchema = new mongoose.Schema(
    {
        poNumber: {
            type: String,
            unique: true,
            required: true
        },

        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true
        },

        items: {
            type: [purchaseOrderItemSchema],
            required: true
        },

        totalAmount: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "Rejected",
                "Received",
                "Cancelled"
            ],
            default: "Pending"
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        approvedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

const PurchaseOrder = mongoose.model(
    "PurchaseOrder",
    purchaseOrderSchema
);

export default PurchaseOrder;