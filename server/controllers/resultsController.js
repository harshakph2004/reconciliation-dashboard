import prisma from "../prisma/client.js";

export const getResults = async (req, res) => {
  try {
    const results = await prisma.reconciliationResult.findMany({
      orderBy: {
        id: "desc",
      },
    });

    console.log(results);

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
    });
  }
};