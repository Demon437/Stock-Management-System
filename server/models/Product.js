import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({

    product_name: {
        type: String,
        required: true,
        trim: true
    },

    product_price: {
        type: Number,
        required: true,
        min: 0
    },

    product_category: {
        type: String,
        required: true,
        
    },

    product_quantity: {
        type: Number,
        required: true,
        min: 0
    }

}, {timestamps: true})

const Product = mongoose.model("Product", productSchema)

export default Product