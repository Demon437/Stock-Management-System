import PurchaseOrder from "../models/PurchaseOrder.js";
import Supplier from "../models/Supplier.js";
import Product from "../models/Product.js";
import User from "../models/Users.js";
import SystemLog from "../models/SystemLog.js";


const generatePONumber = async () => {

    const count = await PurchaseOrder.countDocuments();

    const number = String(count + 1).padStart(4, "0");

    return `PO-${number}`;
};


// CREATE PURCHASE ORDER
export const createPurchaseOrder = async (req, res) => {

    try {

        const {
            supplier,
            items,
            createdBy
        } = req.body;


        if (!supplier || !items || items.length === 0 || !createdBy) {

            return res.status(400).json({
                success: false,
                message: "Supplier, items and createdBy are required"
            });
        }


        const supplierData = await Supplier.findById(supplier);

        if (!supplierData) {

            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }


        let totalAmount = 0;


        for (const item of items) {

            const product = await Product.findById(item.product);

            if (!product) {

                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }


            if (!item.quantity || item.quantity < 1) {

                return res.status(400).json({
                    success: false,
                    message: "Quantity must be at least 1"
                });
            }


            if (item.unitPrice < 0) {

                return res.status(400).json({
                    success: false,
                    message: "Unit price cannot be negative"
                });
            }


            totalAmount +=
                Number(item.quantity) *
                Number(item.unitPrice);
        }


        const poNumber = await generatePONumber();


        const purchaseOrder = await PurchaseOrder.create({

            poNumber,

            supplier,

            items,

            totalAmount,

            createdBy,

            status: "Pending"
        });


        const userData = await User.findById(createdBy);


        await SystemLog.create({

            action: "Purchase order created",

            type: "system",

            user: userData?.name || "Unknown",

            meta: {
                purchaseOrderId: purchaseOrder._id,
                poNumber,
                supplierId: supplier,
                supplierName: supplierData.company_name,
                totalAmount
            }
        });


        const populatedOrder = await PurchaseOrder
            .findById(purchaseOrder._id)
            .populate("supplier", "supplier_name company_name email")
            .populate("items.product", "product_name product_price")
            .populate("createdBy", "name email");


        res.status(201).json({

            success: true,

            message: "Purchase order created successfully",

            purchaseOrder: populatedOrder
        });


    } catch (error) {

        console.error("CREATE PURCHASE ORDER ERROR:", error);

        res.status(500).json({

            success: false,

            message: error.message
        });
    }
};



// GET ALL PURCHASE ORDERS
export const getPurchaseOrders = async (req, res) => {

    try {

        const purchaseOrders = await PurchaseOrder
            .find()
            .populate(
                "supplier",
                "supplier_name company_name email phone"
            )
            .populate(
                "items.product",
                "product_name product_price"
            )
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "approvedBy",
                "name email"
            )
            .sort({ createdAt: -1 });


        res.status(200).json({

            success: true,

            purchaseOrders
        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message
        });
    }
};



// GET ONE PURCHASE ORDER
export const getPurchaseOrderById = async (req, res) => {

    try {

        const purchaseOrder =
            await PurchaseOrder
                .findById(req.params.id)
                .populate(
                    "supplier",
                    "supplier_name company_name email phone address"
                )
                .populate(
                    "items.product",
                    "product_name product_price product_quantity"
                )
                .populate(
                    "createdBy",
                    "name email"
                )
                .populate(
                    "approvedBy",
                    "name email"
                );


        if (!purchaseOrder) {

            return res.status(404).json({

                success: false,

                message: "Purchase order not found"
            });
        }


        res.status(200).json({

            success: true,

            purchaseOrder
        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message
        });
    }
};



// APPROVE PURCHASE ORDER
export const approvePurchaseOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const purchaseOrderId = req.params.id;

        console.log("================================");
        console.log("APPROVE PURCHASE ORDER");
        console.log("PO ID:", purchaseOrderId);
        console.log("USER ID:", userId);
        console.log("================================");

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const userData =
            await User.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "Approving user not found"
            });
        }

        const purchaseOrder =
            await PurchaseOrder.findById(
                purchaseOrderId
            );

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message:
                    "Purchase order not found"
            });
        }

        if (purchaseOrder.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message:
                    `Purchase order is already ${purchaseOrder.status}`
            });
        }

        purchaseOrder.status = "Approved";
        purchaseOrder.approvedBy = userId;
        purchaseOrder.approvedAt = new Date();

        await purchaseOrder.save();

        // Logging cannot break approval
        try {
            await SystemLog.create({
                action:
                    "Purchase order approved",
                type: "system",
                user: userData.name,
                meta: {
                    purchaseOrderId:
                        purchaseOrder._id,
                    poNumber:
                        purchaseOrder.poNumber,
                    totalAmount:
                        purchaseOrder.totalAmount
                }
            });
        } catch (logError) {
            console.error(
                "PURCHASE APPROVE LOG ERROR:",
                logError
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Purchase order approved successfully",
            purchaseOrder
        });

    } catch (error) {
        console.error(
            "APPROVE PURCHASE ORDER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// REJECT PURCHASE ORDER
export const rejectPurchaseOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const purchaseOrderId = req.params.id;

        console.log("================================");
        console.log("REJECT PURCHASE ORDER");
        console.log("PO ID:", purchaseOrderId);
        console.log("USER ID:", userId);
        console.log("================================");

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const userData =
            await User.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const purchaseOrder =
            await PurchaseOrder.findById(
                purchaseOrderId
            );

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message:
                    "Purchase order not found"
            });
        }

        if (purchaseOrder.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message:
                    `Purchase order is already ${purchaseOrder.status}`
            });
        }

        purchaseOrder.status = "Rejected";
        purchaseOrder.approvedBy = userId;
        purchaseOrder.approvedAt = new Date();

        await purchaseOrder.save();

        try {
            await SystemLog.create({
                action:
                    "Purchase order rejected",
                type: "system",
                user: userData.name,
                meta: {
                    purchaseOrderId:
                        purchaseOrder._id,
                    poNumber:
                        purchaseOrder.poNumber
                }
            });
        } catch (logError) {
            console.error(
                "PURCHASE REJECT LOG ERROR:",
                logError
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Purchase order rejected successfully",
            purchaseOrder
        });

    } catch (error) {
        console.error(
            "REJECT PURCHASE ORDER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};