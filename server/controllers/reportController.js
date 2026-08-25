import Product from "../models/Product.js"
import User from "../models/Users.js"
import SystemLog from "../models/SystemLog.js"
import PDFDocument from "pdfkit"


//login activity page function
export const getLoginActivity = async (req, res) => {
  try {
    const logs = await SystemLog.find({type: { $in: ["login", "logout"] }})
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch login activity",
      error: error.message,
    });
  }
};


//system log page function
export const getSystemLogs = async (req, res) => {
  try {
    const logs = await SystemLog.find()
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch system logs",
      error: error.message,
    });
  }
};


//low stock page function
export const getLowStock = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      product_quantity: { $lte: 10 }
    });

    res.status(200).json(lowStockProducts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch low stock products",
      error: error.message,
    });
  }
};


//stock activity page function
export const getStockActivity = async (req, res) => {
  try {
    const logs = await SystemLog.find({
      type: { $in: ["stock", "request", "product"] }
    }).sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stock activity",
      error: error.message,
    });
  }
};


//full report dashboard summary
export const getDashboardSummary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const products = await Product.find();

    const totalStock = products.reduce(
      (sum, item) => sum + (item.product_quantity || 0),
      0
    );

    const lowStock = products.filter(
      (item) => item.product_quantity < 10
    ).length;

    res.status(200).json({
      totalProducts,
      totalUsers,
      totalStock,
      lowStock,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard summary",
      error: error.message,
    });
  }
};

//download pdf button
export const exportFullReportPDF = async (req, res) => {
  try {
    const products = await Product.find();
    const users = await User.find();

    const totalStock = products.reduce(
      (sum, p) => sum + (p.product_quantity || 0),
      0
    );

    const lowStock = products.filter(
      (p) => p.product_quantity < 10
    ).length;

    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
      bufferPages: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=full-report.pdf"
    );

    doc.pipe(res);

    //page header
    doc.fontSize(18).font("Helvetica-Bold").text(
      "INVENTORY SYSTEM REPORT",
      { align: "center" }
    );

    doc.moveDown();

    //summary
    doc.fontSize(10).font("Helvetica");
    doc.text(`Total Products: ${products.length}`);
    doc.text(`Total Users: ${users.length}`);
    doc.text(`Total Stock: ${totalStock}`);
    doc.text(`Low Stock Items: ${lowStock}`);

    doc.moveDown(2);

    const startX = 50;
    const rowHeight = 18;

    //product sheet
    doc.fontSize(12).font("Helvetica-Bold").text("PRODUCTS SHEET");
    doc.moveDown(0.5);

    let y = doc.y + 10;

    const drawProductHeader = (yPos) => {
      doc.fontSize(9).font("Helvetica-Bold");

      doc.text("No", startX, yPos, { width: 30 });
      doc.text("Product", startX + 40, yPos, { width: 180 });
      doc.text("Category", startX + 220, yPos, { width: 120 });
      doc.text("Qty", startX + 350, yPos, { width: 50 });

      doc
        .moveTo(startX, yPos + 12)
        .lineTo(550, yPos + 12)
        .strokeColor("#cccccc")
        .stroke();
    };

    drawProductHeader(y);
    y += rowHeight;

    doc.font("Helvetica").fontSize(9);

    products.forEach((p, i) => {
      if (y > 750) {
        doc.addPage();
        y = 60;

        doc.fontSize(12).font("Helvetica-Bold").text("PRODUCTS (cont.)");
        y += 20;

        drawProductHeader(y);
        y += rowHeight;
      }

      doc.text(i + 1, startX, y, { width: 30 });
      doc.text(p.product_name, startX + 40, y, { width: 180 });
      doc.text(p.product_category, startX + 220, y, { width: 120 });
      doc.text(p.product_quantity, startX + 350, y, { width: 50 });

      doc
        .moveTo(startX, y + 12)
        .lineTo(550, y + 12)
        .strokeColor("#eeeeee")
        .stroke();

      y += rowHeight;
    });
    
    doc.end();
  } catch (error) {
    res.status(500).json({
      message: "PDF generation failed",
      error: error.message,
    });
  }
};

