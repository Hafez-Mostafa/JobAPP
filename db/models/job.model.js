import mongoose, { Schema } from "mongoose";
const jobSchema = new Schema({
    jobTitle: {
        type: String,
        trim: true,
        required: [true, 'Job title is required!']
    },
    jobLocation: {
        type: String,
        enum: ['onsite', 'remotely', 'hybrid'],
        required: [true, 'Job location is required!']
    },
    workingTime: {
        type: String,
        enum: ['part-time', 'full-time'],
        required: [true, 'Working time is required!']
    },
    seniorityLevel: {
        type: String,
        enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
        required: [true, 'Seniority level is required!']
    },
    jobDescription: {
        type: String,
        trim: true,
        required: [true, 'Job description is required!']
    },
    technicalSkills: {
        type: [String],
        required: [true, 'Technical skills are required!']
    },
    softSkills: {
        type: [String],
        required: [true, 'Soft skills are required!']
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Company HR ID is required!']
    },company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }
}, {
    timestamps: true
});

const jobModel = mongoose.model('Job', jobSchema);
export default jobModel;
