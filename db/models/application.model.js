import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, 'Job ID is required!']
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Applier ID is required!']
    },
    userTechSkills: {
        type: [String],
        required: [true, 'User soft skills are required!']
    },
    userSoftSkills: {
        type: [String],
        required: [true, 'User resume is required!']
    },
    userResume: {
        secure_url: String,

        public_id: String,

    }
}, {
    timestamps: true
});
const applicationModel = mongoose.model('Application', applicationSchema)
export default applicationModel;
