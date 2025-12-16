const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    
    console.error(`[ERROR] ${statusCode} - ${err.message}`);
    console.error(err.stack)
    res.status(statusCode).json({
        status: status,
        message: err.message,
        stack: err.stack
    });
};

module.exports = errorHandler