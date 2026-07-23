import express from "express";
import { explainDiscrepancy } from "../controllers/llmController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected AI explanation endpoint
router.post("/explain", authMiddleware, explainDiscrepancy);

export default router;