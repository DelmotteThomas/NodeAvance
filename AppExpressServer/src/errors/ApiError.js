class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
    }
}

class ValidationError extends ApiError {
    constructor(message = 'Mauvaise requête') {
        super(message, 400);
    }
}

class UnauthorizedError extends ApiError {
    constructor(message  = 'Non autorisé , veuillez contacter une administrateur') {
        super(message, 401);
    }
}

class ForbiddenError extends ApiError {
    constructor(message = 'Interdit') {
        super(message, 403);
    }
}

class NotFoundError extends ApiError {
    constructor(message = 'Introuvable') {
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