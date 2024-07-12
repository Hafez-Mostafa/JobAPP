import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../../../config/.env') });

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../../../db/models/user.model.js';
import AppError from "../../../utils/AppError.js";
import { asyncHandling } from "../../../utils/errorHandling.js";
import { otp } from '../../../services/otp.js';
import mongoose from 'mongoose';

//================================signUp=================================================

export const signUp = asyncHandling(async (req, res, next) => {
    const { firstname, lastname, email, password, cpassword, DOB,
         mobileNumber, recoveryEmail,role} = req.body;
    // Check if the user already exists
    const emailExist = await userModel.findOne({ email });
    if (emailExist) return next(new AppError('Email is already in Use', 409));
    // Ensure password and confirm password match
    if (password !== cpassword) return next(new AppError('Passwords do not match', 400));
    // Create token for email confirmation
    const token = jwt.sign({ email }, process.env.JWT_GEN_CONFIRM_EMAIL, { expiresIn: '10s' });
    const refreshToken = jwt.sign({ email }, process.env.JWT_GEN_CONFIRM_EMAIL);
    const otpLink =
        `${req.protocol}://${req.headers.host}/users/verifyEmail/${encodeURIComponent(token)}`;
    const otpRefreshLink =
        `${req.protocol}://${req.headers.host}/users/refreshToken/${encodeURIComponent(refreshToken)}`;
    const checkemail = await otp(process.env.OPT_CONFIRMATION_EMAIL,
        `User Confirmation @${Date.now()}`, `<a href=${otpLink}>Confirm the email</a>
        <br>
        <a href=${otpRefreshLink}>Click here to resend confirmation email</a>`);
    if (!checkemail) return next(new AppError("Error Sending Email", 400));
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Create new user
    const user = new userModel({
        firstname, lastname, email, password: hashedPassword, DOB, mobileNumber,recoveryEmail,role
    });

    const newUser = await user.save();
    if (!newUser) return next(new AppError('User could not be created', 400));

    res.status(201).json({ msg: 'Signed up successfully', user: newUser });
});

//================================emailConfirmation========================================

export const emailConfirmation = asyncHandling(async (req, res, next) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_GEN_CONFIRM_EMAIL);
        const user = await userModel.findOneAndUpdate({ email: decoded.email, confirm: false },
            { confirm: true }, { new: true });

        if (!user) return next(new AppError('User not found or already confirmed', 404));
        res.status(201).json({ msg: 'Email confirmed successfully' });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            // Token has expired, generate a new confirmation link
            const { email } = jwt.decode(token);
            const newToken = jwt.sign({ email }, process.env.JWT_GEN_CONFIRM_EMAIL, { expiresIn: '6h' });
            const otpLink = `${req.protocol}://${req.headers.host}/users/verifyEmail/${encodeURIComponent(newToken)}`;

            const checkemail = await otp(process.env.OPT_CONFIRMATION_EMAIL,
                ':) hehe', `<a href=${otpLink}>Confirm the email</a>`);
            if (!checkemail) return next(new AppError("Error Sending Email", 400));

            return res.status(200).json({ msg: 'Confirmation link has expired. A new confirmation email has been sent.' });
        } else {
            return next(new AppError('Invalid token', 400));
        }
    }
});
//================================refreshToken============================================

export const refreshToken = asyncHandling(async (req, res, next) => {
    const { refreshToken } = req.params;
    const decoded = jwt.verify(refreshToken, process.env.JWT_GEN_CONFIRM_EMAIL);
    const user = await userModel.findOne({ email: decoded.email, confirm: true });
    if (user) return next(new AppError('Email already Confirmed', 400));
    // Create new token
    const token = jwt.sign({ email: decoded.email }, process.env.JWT_GEN_CONFIRM_EMAIL);
    const otpLink = `${req.protocol}://${req.headers.host}/users/verifyEmail/${encodeURIComponent(token)}`;
    const checkemail = await otp(process.env.OPT_CONFIRMATION_EMAIL,
        ':) hehe', `<a href=${otpLink}>Confirm the email</a>`);
    if (!checkemail) return next(new AppError("Error Sending Email", 400));
    res.status(201).json({ msg: 'Email confirmed successfully' });
});

//================================signIn=====================================================
export const signIn = asyncHandling(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('User not found or Invalid credentials', 400));
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    const updateStatus = await userModel.findOneAndUpdate({ email, status: 'offline' }, { status: 'online' }, { new: true })
    if (updateStatus) return next(new AppError('Error Updating Status', 400));
    res.status(200).json({
        message: 'User signed in successfully',
        user: { id: user._id, email: user.email },
        token: token
    });
});
//================================updateUser===============================================

export const updateUser = asyncHandling(async (req, res, next) => {
    const { email, mobileNumber, recoveryEmail, DOB, lastname, firstname } = req.body;
    const userId = req.user.id;
    // Check if another user already has the specified email
    const isExEmail = await userModel.findOne({ email, _id: { $ne: userId } });
    if (isExEmail) return next(new AppError('Email already exists', 409));
    // Check if another user already has the specified mobile number
    const isExmobileNumber = await userModel.findOne({ mobileNumber, _id: { $ne: userId } });
    if (isExmobileNumber) return next(new AppError('Mobile number already exists', 409));
    const user = await userModel.findById(userId);
    if (!user || user.status !== 'online') return next(new AppError('User is offline', 404));
    // Update user 
    const updatedUser = await userModel.findByIdAndUpdate(userId, {
        email, mobileNumber, recoveryEmail, DOB, lastname, firstname
    }, { new: true });
    if (!updatedUser) return next(new AppError('Error updating user', 500));
    res.status(201).json({ msg: 'User Updated Successfully', updatedUser })
})

//================================deleteUser===================================================

export const deleteUser = asyncHandling(async (req, res, next) => {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user || user.status !== 'online') return next(new AppError('User is offline, Delete User is not possible', 404));
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) return next(new AppError('Error Deleting user', 500));
    res.status(201).json({ msg: 'User Deleted Successfully', userId })
})

//================================getUserbyOwner===============================================
export const getUserbyOwner = asyncHandling(async (req, res, next) => {
    const userId = req.user.id;
    const user = await userModel.findOne({ _id: userId, status: 'online' });
    if (!user) return next(new AppError('You Are logged out, log again in', 404));
    res.status(200).json({ msg: 'User Retrieved Successfully', user });
});
//================================visitUser====================================================
export const visitUser = asyncHandling(async (req, res, next) => {
    const { otherId } = req.params
    const user = await userModel.findOne({ _id: otherId });
    if (!user) return next(new AppError('User is not found', 404));
    res.status(200).json({
        msg: 'User Retrieved Successfully',
        user: {
            name: user.username, email: user.email, mobile: user.mobileNumber,
            "Date of Birth": user.DOB.toISOString().split('T')[0]
        }
    });
});

//================================updatePassowrd===================================================
export const updatePassword = asyncHandling(async (req, res, next) => {
    const userId = req.user.id;
    const { password, newPassword } = req.body;
    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user || user.status !== 'online')   return next(new AppError('User is not available or offline!', 404));
    // Check if the current password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)  return next(new AppError('Invalid current password', 400));
    // Hash the new password
    const hashNewPass = await bcrypt.hash(newPassword, +process.env.ROUND_BHASH_PASSWORD);
    // Update the user's password
    const updatedUser = await userModel.findByIdAndUpdate(userId, { password: hashNewPass }, { new: true });
    if (!updatedUser)  return next(new AppError('Error updating password', 500));

    res.status(200).json({ msg: 'Password updated successfully', user: updatedUser });
});


//================================verifiedUsers===============================================
//Get all accounts associated to a specific recovery Email 
export const verifiedUsers = asyncHandling(async (req, res, next) => {
    const userId = req.user.id;
    const{recoveryEmail}=req.body
    const users = await userModel.find({  recoveryEmail });
    if (!users) return next(new AppError('You Are logged out, log again in', 404));
    res.status(200).json({ msg: 'User Retrieved Successfully', users });
});

//================================forgotPassowrd===================================================


export const forgotPassword = asyncHandling(async (req, res, next) => {
    const {  recoveryEmail, newPassword, mobileNumber } = req.body;
    const user = await userModel.findOne({ recoveryEmail, mobileNumber });
    if (!user) return next(new AppError('User is not available!', 404));
    // Check if the user's email is confirmed
    if (!user.confirm) {
        const token = jwt.sign({ recoveryEmail }, process.env.JWT_GEN_CONFIRM_EMAIL, { expiresIn: '1h' });
        const otpLink = `${req.protocol}://${req.headers.host}/users/recoverEmail/${encodeURIComponent(token)}`;
        const checkemail = await otp(
            process.env.OPT_CONFIRMATION_EMAIL, `User Email Recovery @${Date.now()}`,
            `<a href=${otpLink}>Recover Your email</a>`
        );
        if (!checkemail)  return next(new AppError("Error Sending Email", 400));
        return next(new AppError('Your email is not confirmed yet, check your email!', 404));
    }
    // Hash the new password
    const hashNewPass = await bcrypt.hash(newPassword, +process.env.ROUND_BHASH_PASSWORD);
    // Update the user's password
    const recoveredUser = await userModel.findOneAndUpdate(
        {recoveryEmail :email, mobileNumber },{ password: hashNewPass }, { new: true });
    if (!recoveredUser)  return next(new AppError('Error updating password', 500));
    res.status(200).json({ msg: 'Account recovered successfully', user: recoveredUser });
});

//========================================================================================



export const confirmRecoverEmail = asyncHandling(async (req, res, next) => {
    const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_GEN_CONFIRM_EMAIL);
        console.log('decoded',decoded.recoveryEmail)
        const user = await userModel.findOneAndUpdate({ recoveryEmail: decoded.recoveryEmail, confirm: false },
            { confirm: true }, { new: true });
            console.log(user.recoveryEmail)

        if (!user) return next(new AppError('User not found or already confirmed', 404));
        res.status(201).json({ msg: 'Email confirmed successfully and Email Reovered' });
    
});