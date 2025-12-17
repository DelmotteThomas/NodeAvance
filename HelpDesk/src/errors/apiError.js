class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Erreur cote client' : 'error';
        this.isOperational = true;
    }
}

class NotFoundError extends ApiError {
    constructor(message = 'Ressource non trouvée') {
        super(404, message);
    }
}

class ValidationError extends ApiError {
    constructor(message = 'Données invalides') {
        super(400, message);
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = 'Accès non autorisé') {
        super(401, message);
    }
}

module.exports = { 
    ApiError, 
    NotFoundError, 
    ValidationError, 
    UnauthorizedError 
};