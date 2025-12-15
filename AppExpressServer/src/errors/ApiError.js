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

class UnauthorizedError extends ApiError {
    constructor(message) {
        super(message, 401);
    }
}

class ForbiddenError extends ApiError {
    constructor(message) {
        super(message, 403);
    }
}

class NotFoundError extends ApiError {
    constructor(message) {
        super(message, 404);
    }
}


export default 
{
    ApiError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
};