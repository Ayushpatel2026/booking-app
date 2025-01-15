import express, {Request, Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

// /api/users/register
router.post("/register", async (req: Request, res: Response) => {
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
            userId: user._id,
        }, process.env.JWT_SECRET as string, {
            expiresIn: "1d",
        });

        // secure in production but not in development because we use local host not https
        // 1 day = 86400000 milliseconds
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });

        return res.sendStatus(200);

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