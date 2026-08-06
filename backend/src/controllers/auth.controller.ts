import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
    export const register = async (req: Request, res: Response) => {
        try{
        const {name, email, password, confirmPassword } = req.body;
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Both password should match"
            })
        }
        const normalisedemail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(normalisedemail)){
            return res.status(400).json({
                success: false,
                message: "Valid email is required"
            })
        }
        const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if(!passwordRegex.test(password)){
            return res.status(400).json({
                success: false,
                message: "Valid password is required"
            })
        }
        const normalisedName = name.trim();
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "User already exists. Please login"
            })
        }
        await prisma.user.create({
            data: {
                name: normalisedName,
                email,
                password: hashedPassword,
            },
        })
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
        })
    } catch{
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}
export const logging = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })     
        }
        const normalisedemail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(normalisedemail)){
            return res.status(400).json({
                success: false,
                message: "Valid email is required"
            })
        }
        const checkEmail = await prisma.user.findUnique({
            where: {
                email,
            }
        })
        if(!checkEmail){
            return res.status(404).json({
                success: false,
                message: "Not found"
            })
        }
        const checkPassword = await bcrypt.compare(
            password,
            checkEmail.password,
        )
        if(!checkPassword){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        return res.status(200).json({
            success: true,
            message: "user login successful"
        })
    } catch{
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
