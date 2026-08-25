import bcrypt from "bcrypt";
import User from "../models/Users.js";
import SystemLog from "../models/SystemLog.js";

//add user
export const addUser = async (req, res) => {
try {
    const { name, email, password, role, userId } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                error: "Name, email, password and role are required"
            });
        }

        const existing = await User.findOne({ email });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        // add logs
        const adminUser = await User.findById(userId);

        await SystemLog.create({
            action: "User created",
            user: adminUser?.name || "Unknown",
            type: "user",
            meta: {
                createdUserId: user._id,
                createdUserName: user.name,
                role: user.role
            }
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

//get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

//get a user by there ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

//update user
export const updateUser = async (req, res) => {
    try {
    const { id } = req.params;
    const { name, email, password, role, userId } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        // add logs
        const adminUser = await User.findById(userId);

        await SystemLog.create({
            action: "User updated",
            user: adminUser?.name || "Unknown",
            type: "user",
            meta: {
                updatedUserId: user._id,
                updatedUserName: user.name,
                role: user.role
            }
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

//delete user
export const deleteUser = async (req, res) => {
    try {
    const { id } = req.params;
    const { userId } = req.body;

        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        // add logs
        const adminUser = await User.findById(userId);

        await SystemLog.create({
            action: "User deleted",
            user: adminUser?.name || "Unknown",
            type: "user",
            meta: {
                deletedUserId: deleted._id,
                deletedUserName: deleted.name,
                role: deleted.role
            }
        });
  
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};