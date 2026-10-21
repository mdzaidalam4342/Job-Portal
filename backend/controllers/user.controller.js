import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const {
            fullname,
            email,
            phoneNumber,
            password,
            role
        } = req.body;

        if (
            !fullname ||
            !email ||
            !phoneNumber ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exist with this email.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const {
            email,
            password,
            role
        } = req.body;

        console.log("===== LOGIN REQUEST =====");
        console.log("Email:", email);
        console.log("Role:", role);

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const user = await User.findOne({ email });

        console.log("User found:", !!user);

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        console.log("Database role:", user.role);

        const isPasswordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        console.log(
            "Password match:",
            isPasswordMatch
        );

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message:
                    "Account doesn't exist with current role.",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        };

        const token = jwt.sign(
            tokenData,
            process.env.SECRET_KEY,
            {
                expiresIn: "1d"
            }
        );

        const loggedInUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res
            .status(200)
            .cookie(
                "token",
                token,
                {
                    maxAge:
                        1 *
                        24 *
                        60 *
                        60 *
                        1000,
                    httpOnly: true,
                    sameSite: "strict"
                }
            )
            .json({
                message:
                    `Welcome back ${loggedInUser.fullname}`,
                user: loggedInUser,
                success: true
            });

    } catch (error) {
        console.log("LOGIN ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res
            .status(200)
            .cookie(
                "token",
                "",
                {
                    maxAge: 0,
                    httpOnly: true,
                    sameSite: "strict"
                }
            )
            .json({
                message: "Logged out successfully.",
                success: true
            });

    } catch (error) {
        console.log("LOGOUT ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {
            fullname,
            email,
            phoneNumber,
            bio,
            skills,
            education,
            experience,
            github,
            linkedin
        } = req.body;

        const file = req.file;

        const userId = req.id;

        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        if (!user.profile) {
            user.profile = {};
        }

        if (fullname) {
            user.fullname = fullname;
        }

        if (email) {
            user.email = email;
        }

        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }

        user.profile.bio = bio || "";

        if (skills) {
            user.profile.skills = skills
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill);
        } else {
            user.profile.skills = [];
        }

        if (education) {
            user.profile.education = education
                .split(",")
                .map(item => item.trim())
                .filter(item => item);
        } else {
            user.profile.education = [];
        }

        if (experience) {
            user.profile.experience = experience
                .split(",")
                .map(item => item.trim())
                .filter(item => item);
        } else {
            user.profile.experience = [];
        }

        user.profile.github = github || "";
        user.profile.linkedin = linkedin || "";

        if (file) {
            const fileUri = getDataUri(file);

            const cloudResponse =
                await cloudinary.uploader.upload(
                    fileUri.content,
                    {
                        resource_type: "auto",
                        type: "upload"
                    }
                );

            user.profile.resume =
                cloudResponse.secure_url;

            user.profile.resumeOriginalName =
                file.originalname;
        }

        await user.save();

        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });

    } catch (error) {
        console.log("UPDATE PROFILE ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};