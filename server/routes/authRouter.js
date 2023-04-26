import { Router } from "express";
const router = Router();
import { body, validationResult } from "express-validator"
import bcrypt from "bcryptjs"
import User from "../models/user.js"
import { respondWithUser } from "./functions.js"
import { checkAuth } from "../middleware/index.js"


router.post("/signup", body("email").isEmail().withMessage("The email is invalid"), body("password").isLength({ min: 5 }).withMessage("The password should have at least 5 characters"), body("name").isLength(2).withMessage("The name should have at least 2 characters"), async (req, res) => {
    //returns array of errors 
    const validationsErrors = validationResult(req)
    if (!validationsErrors.isEmpty()) {
        const errors = validationsErrors.array().map(error => ({
            msg: error.msg
        }));
        return res.status(400).json({ errors, data: null })
    }
    const { email, password, name } = req.body;
    const user = await User.findOne({ email })

    if (user) {
        return res.status(400).json({
            errors: [
                {
                    msg: "Email already in use"
                }
            ],
            data: null
        })
    }

    const hashedPassword = await bcrypt.hash(process.env.SALT + password, 10)
    const newUser = await User.create({
        email, name, password: hashedPassword, isAdmin: false
    })

    respondWithUser(res, 201, newUser);
})

router.post("/login", body("email").isEmail().withMessage("The email is invalid"), async (req, res) => {
    //returns array of errors
    const validationsErrors = validationResult(req)
    if (!validationsErrors.isEmpty()) {
        const errors = validationsErrors.array().map(error => ({
            msg: error.msg
        }));
        return res.status(400).json({ errors, data: null })
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    //if user does not exist in db
    if (!user) {
        return res.status(400).json({
            errors: [
                {
                    msg: "Invalid credentials"
                }
            ],
            data: null
        })
    }

    const isMatch = await bcrypt.compare(process.env.SALT + password, user.password)

    //passwords does not match
    if (!isMatch) {
        return res.status(400).json({
            errors: [
                {
                    msg: "Invalid credentials"
                }
            ],
            data: null
        })
    }

    respondWithUser(res, 200, user);
})

router.get("/me", checkAuth, async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    respondWithUser(res, 200, user)

})


export default router