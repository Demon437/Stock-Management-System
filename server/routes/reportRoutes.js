import express from "express";

import {
  getLoginActivity,
  getSystemLogs,
  getLowStock,
  getStockActivity,
  exportFullReportPDF,
  getDashboardSummary,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/login-activity", getLoginActivity);
router.get("/system-logs", getSystemLogs);
router.get("/low-stock", getLowStock);
router.get("/activity", getStockActivity);
router.get("/dashboard", getDashboardSummary);
router.get("/export/pdf", exportFullReportPDF);


export default router;