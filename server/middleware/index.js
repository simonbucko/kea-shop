import JWT from "jsonwebtoken";
import { body, validationResult } from "express-validator";

const respondWithUnauthorized = (res) => {
  res.status(403).json({
    errors: [
      {
        msg: "Unauthorized",
      },
    ],
    data: null,
  });
};

export const checkAuth = async (req, res, next) => {
  let token = req.header("authorization");
  if (!token) {
    return respondWithUnauthorized(res);
  }

  token = token.split(" ")[1];

  try {
    const user = await JWT.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return respondWithUnauthorized(res);
  }
};

export const checkAdmin = async (req, res, next) => {
  if (req.user?.isAdmin) next();
  else {
    return respondWithUnauthorized(res);
  }
};

export const singupBodyValidationRules = () => {
  return [
    body("name")
      .isAlphanumeric()
      .withMessage("The name should be alphanumeric")
      .isLength({ min: 2, max: 15 })
      .withMessage("The name should be between 2-15 characters long")
      .escape()
      .trim(),
    body("email").isEmail().withMessage("The email is invalid").trim(),
    body("password")
      .isLength({ min: 5, max: 20 })
      .withMessage("The password should be between 5-20 characters long")
      .trim(),
  ];
};

export const loginBodyValidationRules = () => {
  return [
    body("email").isEmail().withMessage("The email is invalid"),
    body("password")
      .isLength({ min: 5, max: 20 })
      .withMessage("The password should be between 5-20 characters long"),
  ];
};

export const validate = (req, res, next) => {
  const validationsErrors = validationResult(req);
  if (!validationsErrors.isEmpty()) {
    const errors = validationsErrors.array().map((error) => ({
      msg: error.msg,
    }));
    return res.status(400).json({ errors, data: null });
  }

  next();
};
