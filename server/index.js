import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectToDatabase from './db/db.js'

import authRouter from './routes/auth.js'
import productRouter from './routes/productRoutes.js'
import categoryRouter from "./routes/categoryRoutes.js"
import userRouter from "./routes/userRoutes.js"
import requestRouter from "./routes/requestRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import systemLogRouter from "./routes/systemlogRoutes.js"
import reportRouter from "./routes/reportRoutes.js"
import supplierRouter from "./routes/supplierRoutes.js"
import purchaseOrderRouter from "./routes/purchaseOrderRoutes.js";

dotenv.config()

const app = express()

connectToDatabase()

app.use(cors({ origin: "http://localhost:5173" }))

app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Backend Running Successfully"
    })
})

app.use("/api/dashboard", dashboardRouter);

app.use('/api/auth', authRouter);

app.use("/api/category", categoryRouter);

app.use('/api/product', productRouter);

app.use("/api/reports", reportRouter);

app.use("/api/requests", requestRouter);

app.use("/api/logs", systemLogRouter);

app.use("/api/user", userRouter);

app.use("/api/supplier", supplierRouter)

app.use("/api/purchase-orders", purchaseOrderRouter);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`)
})