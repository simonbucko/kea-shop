import { Router } from "express";
import Order from "../models/order.js";
import { ORDER_STATUS } from "../constants/constants.js";
import { sendMail } from "../utils/mailSender/index.js";
import { body } from "express-validator";

const router = Router();

router.post("/", body("deliveryAddress").escape().trim(), async (req, res) => {
  try {
    const newOrder = await Order.create({
      ...req.body,
      status: ORDER_STATUS.processing,
    });
    await sendMail(req.body.email, newOrder._id, req.body.deliveryAddress);
    res.status(201).json({
      errors: [],
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errors: [],
      data: null,
    });
  }
});

export default router;
