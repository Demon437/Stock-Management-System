import mongoose from "mongoose"

const systemLogSchema = new mongoose.Schema({
    action: {
        type: String,
    },
    user: {
        type: String,
    },
    userName: {
        type: String,
    },
    type: {
        type: String,
        enum: ["login", "logout", "product", "user", "stock", "system", "request", "category", "supplier"],
        default: "system"
    },
    meta: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("SystemLog", systemLogSchema)