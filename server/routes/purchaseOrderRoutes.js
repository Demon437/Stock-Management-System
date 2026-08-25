import express from "express";

import {
    createPurchaseOrder,
    getPurchaseOrders,
    getPurchaseOrderById,
    approvePurchaseOrder,
    rejectPurchaseOrder
} from "../controllers/purchaseOrderController.js";

const router = express.Router();


router.post("/create", createPurchaseOrder);

router.get("/", getPurchaseOrders);

router.get("/:id", getPurchaseOrderById);

router.put("/approve/:id", approvePurchaseOrder);

router.put("/reject/:id", rejectPurchaseOrder);


export default router;