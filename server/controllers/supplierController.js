import Supplier from "../models/Supplier.js"
import SystemLog from "../models/SystemLog.js"
import User from "../models/Users.js"


export const addSupplier = async (req, res) => {
    try {

        const {
            supplier_name,
            company_name,
            email,
            phone,
            address,
            userId
        } = req.body

        if (
            !supplier_name ||
            !company_name ||
            !email ||
            !phone ||
            !address
        ) {
            return res.status(400).json({
                success: false,
                error: "All fields are required"
            })
        }

        const existing = await Supplier.findOne({ email })

        if (existing) {
            return res.status(400).json({
                success: false,
                error: "Supplier with this email already exists"
            })
        }

        const supplier = new Supplier({
            supplier_name,
            company_name,
            email,
            phone,
            address
        })

        await supplier.save()

        const user = await User.findById(userId)

        await SystemLog.create({
            action: "Supplier added",
            user: user?.name || "Unknown",
            type: "supplier",
            meta: {
                supplierId: supplier._id,
                supplierName: supplier.supplier_name,
                companyName: supplier.company_name
            }
        })

        return res.status(201).json({
            success: true,
            message: "Supplier added successfully",
            supplier
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


export const getSuppliers = async (req, res) => {
    try {

        const suppliers = await Supplier
            .find()
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            suppliers
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


export const getSupplierById = async (req, res) => {
    try {

        const { id } = req.params

        const supplier = await Supplier.findById(id)

        if (!supplier) {
            return res.status(404).json({
                success: false,
                error: "Supplier not found"
            })
        }

        return res.status(200).json({
            success: true,
            supplier
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


export const updateSupplier = async (req, res) => {
    try {

        const { id } = req.params
        const { userId } = req.body

        const updated = await Supplier.findByIdAndUpdate(
            id,
            {
                supplier_name: req.body.supplier_name,
                company_name: req.body.company_name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                status: req.body.status
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updated) {
            return res.status(404).json({
                success: false,
                error: "Supplier not found"
            })
        }

        const user = await User.findById(userId)

        await SystemLog.create({
            action: "Supplier updated",
            user: user?.name || "Unknown",
            type: "supplier",
            meta: {
                supplierId: updated._id,
                supplierName: updated.supplier_name,
                companyName: updated.company_name
            }
        })

        return res.status(200).json({
            success: true,
            message: "Supplier updated successfully",
            supplier: updated
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


export const deleteSupplier = async (req, res) => {
    try {

        const { id } = req.params
        const { userId } = req.body

        const deleted = await Supplier.findByIdAndDelete(id)

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: "Supplier not found"
            })
        }

        const user = await User.findById(userId)

        await SystemLog.create({
            action: "Supplier deleted",
            user: user?.name || "Unknown",
            type: "supplier",
            meta: {
                supplierId: deleted._id,
                supplierName: deleted.supplier_name,
                companyName: deleted.company_name
            }
        })

        return res.status(200).json({
            success: true,
            message: "Supplier deleted successfully"
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}