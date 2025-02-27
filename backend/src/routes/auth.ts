import express, {Request, Response} from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.post("/login", [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters is required").isLength({ 
        min: 6 }),
], async (req : Request, res : Response) => {

    // check if the request has any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array(),
        });
    }

    const {email, password} = req.body;

    try{
        const user = await User.findOne({ email });

        // it is better to say invalid credentials than invalid email or invalid password for security reasons
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        // generate a token
        const token = jwt.sign({
            userId: user.id,
        }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "1d",
        })

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });

        res.status(200).json({userId: user._id})

    } catch (error){
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
});

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
    res.status(200).send({userId: req.userId});
})

router.post("/logout", (req: Request, res: Response) => {
    // clear the cookie by setting it to an empty string and setting the expiration date to a past date
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });

    res.send();
});

export default router;