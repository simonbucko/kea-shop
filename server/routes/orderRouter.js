import { Router } from "express";
import Order from "../models/order.js";
import { ORDER_STATUS } from "../constants/constants.js";
import { sendMail } from "../utils/mailSender/index.js";
import {
  createOrderBodyValidationRules,
  validate,
} from "../middleware/validation.js";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags:
 *       [Orders]
 *     summary: Create a order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       '201':
 *         description: Order created
 *
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/",
  createOrderBodyValidationRules(),
  validate,
  async (req, res) => {
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
  }
);

export default router;
