import express from "express";

import {
  createRequest,
  getRequests,
  approveRequest,
  rejectRequest,
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/create", createRequest);

router.get("/", getRequests);
router.put("/approve/:id", approveRequest);
router.put("/reject/:id", rejectRequest);

export default router;