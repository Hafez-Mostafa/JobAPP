import path from 'path';
import dotenv from "dotenv";
dotenv.config({ path: path.resolve('config/.env') });
import AppError from "../../utils/AppError.js";
import jwt from 'jsonwebtoken';
import userModel from "../../db/models/user.model.js";


 export const auth = (roles=[]) => {
    return async (req, res, next) => {
        try {
            // Authentication
            const {token} = req.headers;
            if (!token) return next(new AppError('Token not found', 404));
            const bearer = process.env.JWT_BEARER;
            if (!token.startsWith(bearer)) return next(new AppError('Invalid Bearer', 400));

            const newToken = token.slice(bearer.length).trim();
            const decoded = jwt.verify(newToken, process.env.JWT_SECRET);
            if (!decoded) return next(new AppError('Invalid signature', 400));
            const user = await userModel.findById(decoded.id);
            if (!user) return next(new AppError('User is invalid', 400));
            req.user = user;
            // Authorization
            if (!roles.includes(user.role)) {
                return next(new AppError('You do not have permission', 403));
            }

            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return next(new AppError('Invalid token', 400));
            }
            next(error);
        }
    };
};

// export default auth;
