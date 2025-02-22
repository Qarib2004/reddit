import express from "express";
import paypal from "paypal-rest-sdk";
import User from "../models/User.js";

const router = express.Router();

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

router.post("/create", async (req, res) => {
  const { amount } = req.body;

  const payment = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: "http://localhost:5000/api/payment/success",
      cancel_url: "http://localhost:5000/api/payment/cancel",
    },
    transactions: [
      {
        amount: { total: amount, currency: "USD" },
        description: `Buying ${amount * 10} coins`,
      },
    ],
  };

  paypal.payment.create(payment, (error, payment) => {
    if (error) {
      res.status(500).json({ message: "Error creating PayPal payment" });
    } else {
      const approvalUrl = payment.links.find(
        (link) => link.rel === "approval_url"
      ).href;
      res.json({ approvalUrl });
    }
  });
});

router.get("/success", async (req, res) => {
  const { paymentId, PayerID } = req.query;

  paypal.payment.execute(paymentId, { payer_id: PayerID }, async (error, payment) => {
    if (error) {
      return res.redirect("http://localhost:5173/payment-failed");
    }

    const userId = payment.transactions[0].custom;
    const amount = parseFloat(payment.transactions[0].amount.total);

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { coins: amount * 10 } }, // 1$ = 10 монет
      { new: true }
    );

    res.redirect("http://localhost:5173/payment-success");
  });
});

export default router;
