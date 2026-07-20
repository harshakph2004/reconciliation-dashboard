import express from "express";
import multer from "multer";
import { uploadOrders } from "../controllers/uploadOrdersController.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/", upload.single("file"), uploadOrders);

export default router;