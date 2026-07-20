import csv from "csv-parser";
import fs from "fs";

export const uploadCSV = async (req, res) => {
    console.log(req.file);
  try {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        fs.unlinkSync(req.file.path);

        res.json({
          message: "CSV uploaded successfully",
          totalRecords: results.length,
          data: results,
        });
      });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};