import Request from "../models/Request.js";
import Product from "../models/Product.js";
import SystemLog from "../models/SystemLog.js";
import User from "../models/Users.js";

// =====================================================
// CREATE REQUEST
// =====================================================

export const createRequest = async (req, res) => {
    try {
        const {
            product,
            quantity,
            requestedBy
        } = req.body;

        if (!product || !quantity || !requestedBy) {
            return res.status(400).json({
                success: false,
                message: "Product, quantity and requestedBy are required"
            });
        }

        const productData = await Product.findById(product);

        if (!productData) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const userData = await User.findById(requestedBy);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "Requesting user not found"
            });
        }

        const request = await Request.create({
            product,
            quantity: Number(quantity),
            requestedBy,
            status: "Pending",
            handledBy: null
        });

        try {
            await SystemLog.create({
                action: "Request created",
                type: "request",
                user: userData.name,
                meta: {
                    requestId: request._id,
                    productId: product,
                    productName: productData.product_name,
                    quantity: Number(quantity)
                }
            });
        } catch (logError) {
            console.error(
                "REQUEST CREATE LOG ERROR:",
                logError
            );
        }

        return res.status(201).json({
            success: true,
            message: "Request created successfully",
            request
        });

    } catch (error) {
        console.error(
            "CREATE REQUEST ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// GET REQUESTS
// =====================================================

export const getRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .populate(
                "product",
                "product_name product_quantity"
            )
            .populate(
                "requestedBy",
                "name email"
            )
            .populate(
                "handledBy",
                "name email"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            requests
        });

    } catch (error) {
        console.error(
            "GET REQUESTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// APPROVE REQUEST
// =====================================================

export const approveRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        const requestId = req.params.id;

        console.log("================================");
        console.log("APPROVE REQUEST");
        console.log("REQUEST ID:", requestId);
        console.log("USER ID:", userId);
        console.log("================================");

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "Approving user not found"
            });
        }

        const request =
            await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message:
                    `Request is already ${request.status}`
            });
        }

        const product =
            await Product.findById(request.product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (
            Number(product.product_quantity) <
            Number(request.quantity)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Not enough stock. Available: ${product.product_quantity}, Requested: ${request.quantity}`
            });
        }

        // Deduct stock
        product.product_quantity =
            Number(product.product_quantity) -
            Number(request.quantity);

        await product.save();

        // Approve request
        request.status = "Approved";
        request.handledBy = userId;

        await request.save();

        // Logging must NOT make approval fail
        try {
            await SystemLog.create({
                action: "Request approved",
                type: "request",
                user: userData.name,
                meta: {
                    requestId: request._id,
                    productId: product._id,
                    productName:
                        product.product_name,
                    quantity:
                        request.quantity
                }
            });
        } catch (logError) {
            console.error(
                "APPROVE LOG ERROR:",
                logError
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Request approved successfully",
            request
        });

    } catch (error) {
        console.error(
            "APPROVE REQUEST ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// REJECT REQUEST
// =====================================================

export const rejectRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        const requestId = req.params.id;

        console.log("================================");
        console.log("REJECT REQUEST");
        console.log("REQUEST ID:", requestId);
        console.log("USER ID:", userId);
        console.log("================================");

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const request =
            await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message:
                    `Request is already ${request.status}`
            });
        }

        request.status = "Rejected";
        request.handledBy = userId;

        await request.save();

        try {
            const product =
                await Product.findById(
                    request.product
                );

            await SystemLog.create({
                action: "Request rejected",
                type: "request",
                user: userData.name,
                meta: {
                    requestId: request._id,
                    productId: request.product,
                    productName:
                        product?.product_name,
                    quantity:
                        request.quantity
                }
            });
        } catch (logError) {
            console.error(
                "REJECT LOG ERROR:",
                logError
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Request rejected successfully",
            request
        });

    } catch (error) {
        console.error(
            "REJECT REQUEST ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};