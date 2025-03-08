import paypal from "paypal-rest-sdk";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

paypal.configure({
  mode: "sandbox", 
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

export const createPayment = async (req, res) => {
  const { userId, amount } = req.body;

  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const payment = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: `${process.env.CLIENT_URL}/success?userId=${userId}&amount=${amount}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    },
    transactions: [{ amount: { total: amount.toFixed(2), currency: "USD" }, description: `Purchase ${amount} coins` }],
  };

  paypal.payment.create(payment, (error, payment) => {
    if (error) {
      console.error("PayPal error:", error);
      res.status(500).json({ message: "PayPal payment failed" });
    } else {
      const approvalUrl = payment.links.find((link) => link.rel === "approval_url").href;
      res.json({ approvalUrl });
    }
  });
};

export const executePayment = async (req, res) => {
  const { paymentId, PayerID, userId, amount } = req.query;

  const execute = {
    payer_id: PayerID,
    transactions: [{ amount: { total: amount, currency: "USD" } }],
  };

  paypal.payment.execute(paymentId, execute, async (error, payment) => {
    if (error) {
      console.error("PayPal execute error:", error);
      res.status(500).json({ message: "Payment execution failed" });
    } else {
      await User.findByIdAndUpdate(userId, { $inc: { coins: Number(amount) } });
      await Transaction.create({ userId, type: "deposit", amount });

      console.log(`✅ User ${userId} получил ${amount} монет через PayPal`);
      res.redirect(`${process.env.CLIENT_URL}/success`);
    }
  });
};
