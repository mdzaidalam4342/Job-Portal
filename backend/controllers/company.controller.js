import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {

    try {

        const {
            companyName,
            description,
            website,
            location
        } = req.body;

        if (!companyName) {

            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });

        }

        let company = await Company.findOne({
            name: companyName
        });

        if (company) {

            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            });

        }

        company = await Company.create({

            name: companyName,

            description,

            website,

            location,

            userId: req.id

        });

        return res.status(201).json({

            message: "Company registered successfully.",

            company,

            success: true

        });

    } catch (error) {

        console.log("REGISTER COMPANY ERROR:", error);

        return res.status(500).json({

            message: "Internal server error",

            success: false

        });

    }

};


export const getCompany = async (req, res) => {

    try {

        const userId = req.id;

        const companies = await Company.find({
            userId
        });

        if (companies.length === 0) {

            return res.status(404).json({

                message: "Companies not found.",

                success: false

            });

        }

        return res.status(200).json({

            companies,

            success: true

        });

    } catch (error) {

        console.log("GET COMPANY ERROR:", error);

        return res.status(500).json({

            message: "Internal server error",

            success: false

        });

    }

};


export const getCompanyById = async (req, res) => {

    try {

        const companyId = req.params.id;

        const company = await Company.findById(companyId);

        if (!company) {

            return res.status(404).json({

                message: "Company not found.",

                success: false

            });

        }

        return res.status(200).json({

            company,

            success: true

        });

    } catch (error) {

        console.log("GET COMPANY BY ID ERROR:", error);

        return res.status(500).json({

            message: "Internal server error",

            success: false

        });

    }

};


export const updateCompany = async (req, res) => {

    try {

        const {
            name,
            description,
            website,
            location
        } = req.body;

        const file = req.file;

        let updateData = {
            name,
            description,
            website,
            location
        };

        if (file) {

            const fileUri = getDataUri(file);

            const cloudResponse =
                await cloudinary.uploader.upload(
                    fileUri.content
                );

            updateData.logo =
                cloudResponse.secure_url;

        }

        const company =
            await Company.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true
                }
            );

        if (!company) {

            return res.status(404).json({

                message: "Company not found.",

                success: false

            });

        }

        return res.status(200).json({

            message: "Company information updated.",

            company,

            success: true

        });

    } catch (error) {

        console.log("UPDATE COMPANY ERROR:", error);

        return res.status(500).json({

            message: "Internal server error",

            success: false

        });

    }

};