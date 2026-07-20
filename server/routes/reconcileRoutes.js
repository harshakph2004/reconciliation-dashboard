import express from "express";
import { reconcileData } from "../controllers/reconcileController.js";

const router = express.Router();

router.post("/", reconcileData);

export default router;