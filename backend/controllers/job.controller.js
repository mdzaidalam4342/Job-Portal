import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId
        } = req.body;

        const userId = req.id;

        if (
            !title ||
            !description ||
            !requirements ||
            salary === undefined ||
            salary === "" ||
            !location ||
            !jobType ||
            experience === undefined ||
            experience === "" ||
            position === undefined ||
            position === "" ||
            !companyId
        ) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: Array.isArray(requirements)
                ? requirements
                : requirements.split(",").map(item => item.trim()).filter(Boolean),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            position: Number(position),
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log("POST JOB ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        const jobs = await Job.find({
            $or: [
                {
                    title: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: keyword,
                        $options: "i"
                    }
                }
            ]
        })
            .populate("company")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log("GET ALL JOBS ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("company")
            .populate("applications");

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.log("GET JOB BY ID ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getAdminJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            created_by: req.id
        })
            .populate("company")
            .populate("applications")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log("GET ADMIN JOBS ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position
        } = req.body;

        const updates = {};

        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (location !== undefined) updates.location = location;
        if (jobType !== undefined) updates.jobType = jobType;

        if (requirements !== undefined) {
            updates.requirements = Array.isArray(requirements)
                ? requirements
                : requirements.split(",").map(item => item.trim()).filter(Boolean);
        }

        if (salary !== undefined) updates.salary = Number(salary);
        if (experience !== undefined) updates.experienceLevel = Number(experience);
        if (position !== undefined) updates.position = Number(position);

        const job = await Job.findOneAndUpdate(
            {
                _id: req.params.id,
                created_by: req.id
            },
            { $set: updates },
            { new: true, runValidators: true }
        ).populate("company");

        if (!job) {
            return res.status(404).json({
                message: "Job not found or you do not have permission to edit it.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log("UPDATE JOB ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            created_by: req.id
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found or you do not have permission to delete it.",
                success: false
            });
        }

        await Application.deleteMany({ job: job._id });
        await Job.findByIdAndDelete(job._id);

        return res.status(200).json({
            message: "Job and its applications deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log("DELETE JOB ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};