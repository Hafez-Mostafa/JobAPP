import mongoose ,{Schema}from "mongoose";


const companySchema = new Schema({
    companyName: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Company name is required!']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Description is required!']
    },
    industry: {
        type: String,
        trim: true,
        required: [true, 'Industry is required!']
    },
    address: {
        type: String,
        required: [true, 'Address is required!']
    },
    numberOfEmployees: {
        type: Number,
        min: 11,
        max: 20,
        required: [true, 'Number of employees is required!']
    },
    companyEmail: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Company email is required!']
    },
    companyHR: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Company HR ID is required!']
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const Company = mongoose.model('Company', companySchema);

export default Company;
