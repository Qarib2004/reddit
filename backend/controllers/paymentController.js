import paypal from "paypal-rest-sdk";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

paypal.configure({
  mode: process.env.PAYPAL_MODE, 
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

export const createPayment = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Incorrect amount" });
    }

    const paymentData = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `http://localhost:5000/api/payments/success?userId=${userId}&amount=${amount}`,
        cancel_url: "http://localhost:5000/api/payments/cancel",
      },
      transactions: [
        {
          amount: { total: amount.toFixed(2), currency: "USD" },
          description: "Balance replenishment",
        },
      ],
    };

    paypal.payment.create(paymentData, (error, payment) => {
      if (error) {
        console.error("PayPal error:", error);
        return res.status(500).json({ message: "Creating a payment error" });
      }

      const approvalUrl = payment.links.find((link) => link.rel === "approval_url");
      if (!approvalUrl) return res.status(500).json({ message: "Failed to get a payment link" });

      res.json({ approvalUrl: approvalUrl.href });
    });
  } catch (error) {
    res.status(500).json({ message: "Creating a payment error", error });
  }
};

export const executePayment = async (req, res) => {
  const { paymentId, PayerID, userId, amount } = req.query;

  const executeData = { payer_id: PayerID };

  try {
    paypal.payment.execute(paymentId, executeData, async (error, payment) => {
      if (error) {
        console.error("PayPal confirmation error:", error);
        return res.status(500).json({ message: "Error confirmation of paymentа" });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "The user was not found" });

      user.wallet += parseFloat(amount);
      user.walletTransactions.push({ amount, transactionId: paymentId, status: "completed" });

      await user.save();

      res.json({
        message: "The payment is successfully completed",
        wallet: user.wallet,
        transaction: { amount, transactionId: paymentId, status: "completed" },
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Error when confirming payment", error });
  }
};

export const cancelPayment = (req, res) => {
  res.status(400).json({ message: "The payment is canceled" });
};
