import prisma from "../prisma/client.js";

export const reconcileData = async (req, res) => {
  try {
    console.log("========== RECONCILIATION STARTED ==========");

    console.log("Deleting old reconciliation results...");
    await prisma.reconciliationResult.deleteMany();

    console.log("Fetching orders...");
    const orders = await prisma.order.findMany();

    console.log("Fetching payments...");
    const payments = await prisma.payment.findMany();

    console.log("Orders:", orders.length);
    console.log("Payments:", payments.length);

    const paymentMap = new Map();

    console.log("Creating payment map...");
    for (const payment of payments) {
      if (!paymentMap.has(payment.orderReference)) {
        paymentMap.set(payment.orderReference, []);
      }

      paymentMap.get(payment.orderReference).push(payment);
    }

    console.log("Payment map created.");

    const results = [];

    console.log("Reconciling orders...");

    for (const order of orders) {
      const matchedPayments = paymentMap.get(order.orderId) || [];

      if (matchedPayments.length === 0) {
        results.push({
          orderId: order.orderId,
          transactionRef: null,
          issueType: "Missing Payment",
          orderAmount: order.netAmount,
          paymentAmount: null,
          difference: order.netAmount,
          status: "Open",
        });

        continue;
      }

      if (matchedPayments.length > 1) {
        for (const payment of matchedPayments) {
          results.push({
            orderId: order.orderId,
            transactionRef: payment.transactionRef,
            issueType: "Duplicate Payment",
            orderAmount: order.netAmount,
            paymentAmount: payment.amount,
            difference: Number(
              (payment.amount - order.netAmount).toFixed(2)
            ),
            status: "Open",
          });
        }

        continue;
      }

      const payment = matchedPayments[0];

      const diff = Number(
        (payment.amount - order.netAmount).toFixed(2)
      );

      if (Math.abs(diff) > 0.01) {
        results.push({
          orderId: order.orderId,
          transactionRef: payment.transactionRef,
          issueType: "Amount Mismatch",
          orderAmount: order.netAmount,
          paymentAmount: payment.amount,
          difference: diff,
          status: "Open",
        });
      } else {
        results.push({
          orderId: order.orderId,
          transactionRef: payment.transactionRef,
          issueType: "Matched",
          orderAmount: order.netAmount,
          paymentAmount: payment.amount,
          difference: 0,
          status: "Matched",
        });
      }
    }

    console.log("Results prepared:", results.length);

    console.log("Saving to database...");
    await prisma.reconciliationResult.createMany({
      data: results,
    });

    console.log("Saved successfully!");
    console.log("========== RECONCILIATION COMPLETED ==========");

    return res.status(200).json({
      success: true,
      message: "Reconciliation completed successfully",
      totalOrders: orders.length,
      totalPayments: payments.length,
      totalResults: results.length,
    });
  } catch (err) {
    console.error("========== RECONCILIATION ERROR ==========");
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};