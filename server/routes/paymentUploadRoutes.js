import express from "express";
import multer from "multer";
import { uploadPayments } from "../controllers/uploadPaymentsController.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/", upload.single("file"), uploadPayments);

export default router;