import { getUserByEmail, User } from "../models/user";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
require('dotenv').config();

// Handle errors
export const HandleErrors = (err: any) => {
    console.log(err.message, err.code);
    let errors: any = { username: "", email: "", password: "" };

    // incorrect email
    if (err.message === "incorrect email") {
        errors.email = "That email is not registered";
    }

    // incorrect usename
    if (err.message === "incorrect username") {
        errors.username = "That username is not registered";
    }

    // incorrect password
    if (err.message === "incorrect password") {
        errors.password = "XXXX password is incorrect";
    }

    // duplicate error code
    if (err.code === 11000) {
        errors.email = "Email is already registered";
        return errors;
    }

    // validation errors
    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach(({ properties }: any) => {
            errors[properties.path] = properties.message;
        });
        return errors;
    }
    return errors;
};

export const createToken = (id: String) => {
    const JWT_SECRET = 'voting-app-jwt-secret';
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: "3d",
    });
};


export class Authcontroller {
    static async register(req: Request, res: Response) {
        const { username, email, password } = req.body;

        try {
            const user = await User.create({ username, email, password })
            const token = createToken(user._id);

            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
           });
           console.log(token);

           res.status(201).json({ user: user._id });
        } catch (err: any) {
            const errors = HandleErrors(err);
            res.status(400).json({ errors });
        }
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user = await getUserByEmail(email);
            if (user) {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (isPasswordValid) {
                    const token = createToken(user._id);
                    res.cookie("jwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
                    res.status(200).json({ user: user._id });
                } else {
                    throw new Error("incorrect password");
                }
            } else {
                throw new Error("incorrect email");
            }
        } catch (err: any) {
            const errors = HandleErrors(err);
            res.status(400).json({ errors });
        }
    }  
};