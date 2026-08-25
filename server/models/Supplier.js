import mongoose from "mongoose"

const supplierSchema = new mongoose.Schema(
    {
        supplier_name: {    
            type: String,
            required: true,
            trim: true
        },

        company_name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    { timestamps: true }
)

const Supplier = mongoose.model("Supplier", supplierSchema)

export default Supplier