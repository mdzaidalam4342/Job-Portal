import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Student applies for a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

    } catch (error) {
        console.error("APPLY JOB ERROR:", error);

        return res.status(500).json({
            message: "Failed to apply for the job.",
            success: false
        });
    }
};


// Student views applied jobs and application status
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const applications = await Application.find({
            applicant: userId
        })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                populate: {
                    path: "company"
                }
            });

        return res.status(200).json({
            application: applications,
            success: true
        });

    } catch (error) {
        console.error("GET APPLIED JOBS ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch applied jobs.",
            success: false
        });
    }
};


// Recruiter views applicants for a job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: {
                sort: { createdAt: -1 }
            },
            populate: {
                path: "applicant",
                select: "fullname email phoneNumber profile"
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Verify that the logged-in recruiter owns this job
        if (
            !job.created_by ||
            job.created_by.toString() !== req.id.toString()
        ) {
            return res.status(403).json({
                message: "You are not authorized to view these applicants.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.error("GET APPLICANTS ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch applicants.",
            success: false
        });
    }
};


// Recruiter accepts or rejects an application
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        // Validate the requested status
        if (
            typeof status !== "string" ||
            !["pending", "accepted", "rejected"].includes(
                status.toLowerCase()
            )
        ) {
            return res.status(400).json({
                message: "Invalid application status.",
                success: false
            });
        }

        // Find the application
        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Find the job related to this application
        const job = await Job.findById(application.job);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Verify that the logged-in recruiter owns this job
        if (
            !job.created_by ||
            job.created_by.toString() !== req.id.toString()
        ) {
            return res.status(403).json({
                message: "You are not authorized to update this application.",
                success: false
            });
        }

        // Update and save the application status
        application.status = status.toLowerCase();

        await application.save();

        return res.status(200).json({
            message: `Application ${application.status} successfully.`,
            application,
            success: true
        });

    } catch (error) {
        console.error("UPDATE STATUS ERROR:", error);

        return res.status(500).json({
            message: "Failed to update application status.",
            success: false
        });
    }
};