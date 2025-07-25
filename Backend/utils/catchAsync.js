 export const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            console.error('🚨 Async error caught:', {
                message: err.message,
                stack: err.stack,
                url: req.originalUrl,
                method: req.method,
                body: req.body,
                params: req.params,
                user: req.user ? req.user._id : 'No user'
            });
            next(err);
        });
    };
}; 
