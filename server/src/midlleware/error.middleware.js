const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'Internal Server Error';

    if (process.env.NODE_ENV !== 'production') {
        console.error(`[Error] ${statusCode} - ${message}`);
    }

    return res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
        },
    });
};

export default errorHandler;
