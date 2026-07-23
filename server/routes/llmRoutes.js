import express from "express";
import { explainDiscrepancy } from "../controllers/llmController.js";

const router = express.Router();

router.post("/explain", explainDiscrepancy);

export default router;