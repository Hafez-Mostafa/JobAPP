
import mongoose, { Schema } from "mongoose";
import { isValid, parseISO, format } from 'date-fns';
import systemRoles from "../../utils/systemRoles.js";

const generateUsername = (firstname, lastname) => {
    return `${firstname} ${lastname}`;
}

const userSchema = new Schema({
    firstname: {
        type: String, 
        trim: true, 
        required: [true, 'First name is required!'], 
        lowercase: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [15, 'Name must not be more than 15 characters long']
    },
    lastname: {
        type: String, 
        trim: true, 
        required: [true, 'Last name is required!'], 
        lowercase: true,
        minlength: [3, 'Name must be at least 3 characters long'], 
        maxlength: [15, 'Name must not be more than 15 characters long']
    },
    username: {
        type: String,
        unique: true
    }, 
    email: { 
        type: String, 
        trim: true, 
        required: [true, 'Email is required!'], 
        lowercase: true, 
        unique: true
    },
    password: { 
        type: String, 
        trim: true, 
        required: [true, 'Password is required!'] 
    },
    recoveryEmail: { 
        type: String,
        trim: true,
        lowercase: true
    },
    DOB: {
        type: Date
        ,
        required: [true, 'Date of Birth is required!'],
        validate: {
            validator: (value)=> {
                // Check if value is a valid date
                if (!(value instanceof Date) || isNaN(value.getTime())) {
                    return false;
                }
                // Ensure the date is in the past
                const today = new Date();
                if (value >= today) {
                    return false;
                }
                // (Optional) Ensure the date is within a realistic range (e.g., not more than 120 years ago)
                const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
                
                if (value < minDate) {
                    return false;
                }
                return true;
            },
            message: 'Invalid date format or date is not in a valid range.'
           }   }
    ,
    mobileNumber: { 
        type: Number, 
        unique: true 
    },
    role: {
        type: String,
        enum: Object.values(systemRoles),
        default: 'user'
    },
    confirm: {
        type: Boolean, 
        default: false
    },
    status: {
        type: String, 
        enum: ['online', 'offline'], 
        default: 'offline'
    }
});


userSchema.pre('save', function(next) {
    // Convert DOB to Date object if it's a string
    if (typeof this.DOB === 'string') {
        this.DOB = new Date(this.DOB);
    }
    next();
});

userSchema.pre('save', function(next) {
    if (this.isModified('firstname') || this.isModified('lastname')) {
        this.username = generateUsername(this.firstname, this.lastname);
    }
    next();
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
