import csv from "csv-parser";
import fs from "fs";
import prisma from "../prisma/client.js";

export const uploadPayments = async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        for (const row of results) {
          console.log("Processing:", row);

          // Validate and convert date
          let processedDate = null;

          if (row.processed_at) {
            const parsedDate = new Date(row.processed_at);

            if (!isNaN(parsedDate.getTime())) {
              processedDate = parsedDate;
            }
          }

          await prisma.payment.upsert({
            where: {
              transactionRef: row.transaction_ref,
            },
            update: {
              processedAt: processedDate,
              orderReference: row.order_reference,
              currency: row.currency,
              amount: parseFloat(row.amount),
              fee: parseFloat(row.fee),
              netSettled: parseFloat(row.net_settled),
              type: row.type,
              status: row.status,
            },
            create: {
              transactionRef: row.transaction_ref,
              processedAt: processedDate,
              orderReference: row.order_reference,
              currency: row.currency,
              amount: parseFloat(row.amount),
              fee: parseFloat(row.fee),
              netSettled: parseFloat(row.net_settled),
              type: row.type,
              status: row.status,
            },
          });
        }

        // Delete uploaded CSV
        fs.unlinkSync(req.file.path);

        return res.status(200).json({
          message: `${results.length} Payments Imported Successfully`,
        });
      } catch (err) {
        console.error("❌ Error importing payments:");
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