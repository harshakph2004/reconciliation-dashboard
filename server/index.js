import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderUploadRoutes from "./routes/orderUploadRoutes.js";
import paymentUploadRoutes from "./routes/paymentUploadRoutes.js";
import reconcileRoutes from "./routes/reconcileRoutes.js";
import resultsRoutes from "./routes/resultsRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/upload/orders", orderUploadRoutes);
app.use("/api/upload/payments", paymentUploadRoutes);
console.log("Loading reconcile routes...");
app.use("/api/reconcile", reconcileRoutes);
app.use("/api/results", resultsRoutes);
app.get("/api/test-results", (req, res) => {
  res.json({ message: "Results route reached" });
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});