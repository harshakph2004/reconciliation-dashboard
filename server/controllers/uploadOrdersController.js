import csv from "csv-parser";
import fs from "fs";
import prisma from "../prisma/client.js";

export const uploadOrders = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded",
    });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", async () => {
      try {
        console.log("Orders found:", results.length);

        await prisma.order.deleteMany();

        const seen = new Set();

        for (const row of results) {
          const orderId = row.order_id.trim();

          if (seen.has(orderId)) {
            console.log("Duplicate Order ID in CSV:", orderId);
            continue;
          }

          seen.add(orderId);

          const orderDate = new Date(row.order_date);

          await prisma.order.upsert({
            where: {
              orderId: orderId,
            },
            update: {
              orderDate: orderDate,
              customerEmail: row.customer_email?.trim() || null,
              currency: row.currency.trim(),
              grossAmount: parseFloat(row.gross_amount) || 0,
              discount: parseFloat(row.discount || "0"),
              netAmount: parseFloat(row.net_amount) || 0,
              status: row.status.trim(),
            },
            create: {
              orderId: orderId,
              orderDate: orderDate,
              customerEmail: row.customer_email?.trim() || null,
              currency: row.currency.trim(),
              grossAmount: parseFloat(row.gross_amount) || 0,
              discount: parseFloat(row.discount || "0"),
              netAmount: parseFloat(row.net_amount) || 0,
              status: row.status.trim(),
            },
          });
        }

        fs.unlinkSync(req.file.path);

        return res.status(200).json({
          message: "Orders Imported Successfully",
        });
      } catch (err) {
        console.error("ORDER IMPORT ERROR");
        console.error(err);

        return res.status(500).json({
          error: err.message,
        });
      }
    })
    .on("error", (err) => {
      console.error(err);

      return res.status(500).json({
        error: err.message,
      });
    });
};