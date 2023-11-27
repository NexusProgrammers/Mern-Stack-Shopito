import express from "express";
import cors from "cors";
import { config } from "dotenv";
import stripePackage from "stripe";

config();

const app = express();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.dish,
        images: [product.imgdata],
      },
      unit_amount: product.price * 100,
    },
    quantity: product.qnty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ id: session.id });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Starting Server On Port ${PORT}`);
});
