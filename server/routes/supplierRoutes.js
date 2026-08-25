import express from "express"

import {
    addSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} from "../controllers/supplierController.js"

const router = express.Router()

router.post("/add", addSupplier)

router.get("/", getSuppliers)

router.get("/:id", getSupplierById)

router.put("/:id", updateSupplier)

router.delete("/:id", deleteSupplier)

export default router