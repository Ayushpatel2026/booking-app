import express, {Request, Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import {check, validationResult} from "express-validator";

const router = express.Router();

// /api/users/register
router.post("/register", [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
        min: 6,
    }),
], async (req: Request, res: Response) => {

    // check if the request has any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array(),
        });
    }

    try{
        // find a user in the database with the same email as the request email
        let user = await User.findOne({
            email: req.body.email,
        });

        if (user) {
            return res.status(400).json({
                message: "User already exists",
            })
        }

        user = new User(req.body);
        await user.save();

        const token = jwt.sign({
            userId: user.id,
        }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "1d",
        });

        // secure in production but not in development because we use local host not https
        // 1 day = 86400000 milliseconds
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });

        return res.status(200).send({message: "User registered OK"});

    }catch (error) {

        //log the error to the bacekend console
        console.log(error);

        // keep the error message generic so we don't leak any sensitive information to the frontend
        res.status(500).send({
            message: "Something went wrong"
        })
    }
});

export default router;