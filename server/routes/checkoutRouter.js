import { Router } from "express";
import Stripe from 'stripe'

const router = Router();

router.post("/", async (req, res) => {
    // initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET)
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'eur',
        payment_method_types: ['card'],
    })

    res.status(200).json({
        errors: [],
        data: {
            clientSecret: paymentIntent.client_secret
        }
    })
})

export default router