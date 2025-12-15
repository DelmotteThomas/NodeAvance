class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
    }
}

class ValidationError extends ApiError {
    constructor(message) {
        super(message, 400);
    }
}

class NotFoundError extends ApiError {
    constructor(message) {
        super(message, 404);
    }
}





module.exports = 
{
    ApiError,
    ValidationError,
    NotFoundError,

};