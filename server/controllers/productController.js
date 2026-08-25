import Product from "../models/Product.js";
import SystemLog from "../models/SystemLog.js";
import User from "../models/Users.js";


export const getProducts = async (req, res) => {

    try {

        const products = await Product.find()

        return res.status(200).json({
            success: true,
            products
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const addProduct = async (req, res) => {
  try {

    const {
      product_name,
      product_price,
      product_category,
      product_quantity,
      userId
    } = req.body;

    const newProduct = new Product({
      product_name,
      product_price,
      product_category,
      product_quantity
    });

    await newProduct.save();

    //add logs
    const user = await User.findById(userId);

    await SystemLog.create({
      action: "Product added",
      user: user?.name || "Unknown",
      type: "product",
      meta: {
        productId: newProduct._id,
        productName: newProduct.product_name,
        quantity: newProduct.product_quantity,
        category: newProduct.product_category,
        price: newProduct.product_price
      }
    });

    return res.status(201).json({
      success: true,
      message: "Product Added",
      product: newProduct
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const updateProduct = async (req, res) => {

  try {

    const updatedProduct = await Product.findByIdAndUpdate(

      req.params.id,

      {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_category: req.body.product_category,
        product_quantity: req.body.product_quantity
      },

      { new: true }

    );

    //add logs
    const user = await User.findById(req.body.userId);

    await SystemLog.create({
      action: "Product updated",
      user: user?.name || "Unknown",
      type: "product",
      meta: {
        productId: updatedProduct._id,
        productName: updatedProduct.product_name,
        quantity: updatedProduct.product_quantity,
        category: updatedProduct.product_category,
        price: updatedProduct.product_price
      }
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id)

        return res.status(200).json({
            success: true,
            product
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const deleteProduct = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    await Product.findByIdAndDelete(req.params.id);

    //add logs
    const user = await User.findById(req.body.userId);
    await SystemLog.create({
      action: "Product deleted",
      user: user?.name || "Unknown",
      type: "product",
      meta: {
        productId: product?._id,
        productName: product?.product_name,
        quantity: product?.product_quantity,
        category: product?.product_category
      }
    });

    return res.status(200).json({
      success: true,
      message: "Product deleted"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
