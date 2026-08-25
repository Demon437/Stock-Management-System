import Category from "../models/Category.js"
import SystemLog from "../models/SystemLog.js"
import User from "../models/Users.js"


export const addCategory = async (req, res) => {
try {
    const { category_name, userId } = req.body

    if (!category_name) {
        return res.status(400).json({
            success: false,
            error: "Category name is required"
        })
    }

    const existing = await Category.findOne({ category_name })

    if (existing) {
        return res.status(400).json({
            success: false,
            error: "Category already exists"
        })
    }

    const newCategory = new Category({ category_name })
    await newCategory.save()

    // add logs
    const user = await User.findById(userId)
    await SystemLog.create({
        action: "Category added",
        user: user?.name || "Unknown",
        type: "category",
        meta: {
            categoryId: newCategory._id,
            categoryName: newCategory.category_name
        }
    })

    return res.status(201).json({
        success: true,
        message: "Category created successfully"
    })

} catch (error) {
    return res.status(500).json({
        success: false,
        error: error.message
    })
}
}


export const getCategories = async (req, res) => {
    try {

        const categories = await Category.find().sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            categories
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


export const getCategoryById = async (req, res) => {
    try {

        const { id } = req.params

        const category = await Category.findById(id)

        if (!category) {
            return res.status(404).json({
                success: false,
                error: "Category not found"
            })
        }

        return res.status(200).json({
            success: true,
            category
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


export const updateCategory = async (req, res) => {
try {
    const { id } = req.params
    const { userId } = req.body

    const updated = await Category.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    )

    if (!updated) {
        return res.status(404).json({
            success: false,
            error: "Category not found"
        })
    }

    // add logs
    const user = await User.findById(userId)
    await SystemLog.create({
        action: "Category updated",
        user: user?.name || "Unknown",
        type: "category",
        meta: {
            categoryId: updated._id,
            categoryName: updated.category_name
        }
    })

    return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category: updated
    })

} catch (error) {
    return res.status(500).json({
        success: false,
        error: error.message
    })
}
}


export const deleteCategory = async (req, res) => {
try {
    const { id } = req.params
    const { userId } = req.body

    const deleted = await Category.findByIdAndDelete(id)

    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: "Category not found"
        })
    }

    // add logs
    const user = await User.findById(userId)
    await SystemLog.create({
        action: "Category deleted",
        user: user?.name || "Unknown",
        type: "category",
        meta: {
            categoryId: deleted._id,
            categoryName: deleted.category_name
        }
    })

    return res.status(200).json({
        success: true,
        message: "Category deleted successfully"
    })

} catch (error) {
    return res.status(500).json({
        success: false,
        error: error.message
    })
}
}