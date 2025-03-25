import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {compare} from "bcrypt";
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email,userId) => {
    return jwt.sign({email,userId}, process.env.JWT_SECRET, {expiresIn: maxAge});
};

export const signup = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).send("Email and password are required");
        }
        const user = await User.create({email, password});
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "none",
        });
        return res.status(201).json({
            user:{
                _id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
};

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).send("Email and password are required");
        }
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).send("User not found");
        }
        const auth = await compare(password, user.password);
        if(!auth) {
            return res.status(400).send("Invalid password");
        }
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "none",
        });
        return res.status(200).json({
            user:{
                _id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
                color: user.color,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
};


export const getUserInfo = async (req, res, next) => {
    try {
        
        const userData = await User.findById(req.userId);
        if(!userData){
            return res.status(404).send("User not found");
        }

        return res.status(200).json({
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,  
            
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const {userId} = req;
        const {firstName, lastName, color} = req.body;
        if(!firstName || !lastName) {
            return res.status(400).send("First name, last name and color are required");
        }
        const userData = await User.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            color,
            profileSetup: true,
        }, {new: true, runValidators: true}
    );


    return res.status(200).json({
        id: userData._id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,  
    });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
};