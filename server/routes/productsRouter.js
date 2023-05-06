import { Router } from "express";
import Product from "../models/product.js";
import { checkAuth, checkAdmin } from "../middleware/auth.js";
import escapeRegExp from "lodash/escapeRegExp.js";

const router = Router();

router.post("/", checkAuth, checkAdmin, async (req, res) => {
  await Product.create(req.body);

  res.status(201).json({
    errors: [],
    data: null,
  });
});

router.get("/", async (req, res) => {
  let { page, limit, priceOrder, searchText } = req.query;

  const query = Product.find();
  if (searchText && searchText !== "") {
    const regex = new RegExp(escapeRegExp(searchText));
    query.where("name").equals({ $regex: regex, $options: "i" });
  }
  if (priceOrder && priceOrder !== "") {
    switch (priceOrder) {
      case "ASC":
        query.sort({ price: 1 });
        break;
      case "DESC":
        query.sort({ price: -1 });
        break;
    }
  }
  const totalCount = (await query.exec())?.length;
  const products = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .clone();

  res.status(200).json({
    errors: [],
    data: {
      products,
      totalCount,
    },
  });
});

router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        errors: [
          {
            msg: "Product not found",
          },
        ],
        data: null,
      });
    }
    res.status(200).json({
      errors: [],
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(404).json({
      errors: [
        {
          msg: "Product not found",
        },
      ],
      data: null,
    });
  }
});

export default router;
