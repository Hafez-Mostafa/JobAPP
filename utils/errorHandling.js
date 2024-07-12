export const asyncHandling = (fn) => {
    return (req, res, next) => {
        fn(req, res, next)
            .catch((err) => {
                next(err)
            })
    }

}

// Global error handling middleware
export const globalErrorHandling = (err,req,res,next)=>{
    if(res.headersSent) return next(err)
    res.status(err.statusCode || 400).json({msg:'Error',err:err.message})

} 




// export const globalErrorHandling = (err, req, res, next) => {
//     if (res.headersSent) {
//         return next(err);
//     }

//     // Log the error message only, not the stack trace
//     console.error('Error:', err.message);

//     // Handle known AppError instances
//     if (err instanceof AppError) {
//         res.status(err.statusCode).json({
//             status: 'error',
//             message: err.message,
//         });
//     } else {
//         // Handle unknown errors
//         res.status(500).json({
//             status: 'error',
//             message: 'An unexpected error occurred',
//         });
//     }
// };