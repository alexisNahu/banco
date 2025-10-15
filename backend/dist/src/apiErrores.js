export class ApiError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
// Errores del cliente (400-500)
export class ClientSideErrors extends ApiError {
}
export class BadRequestError extends ClientSideErrors {
    constructor(message = 'BAD_REQUEST') { super(message, 400); }
}
export class UnauthorizedError extends ClientSideErrors {
    constructor(message = 'UNAUTHORIZED') { super(message, 401); }
}
export class ForbiddenError extends ClientSideErrors {
    constructor(message = 'FORBIDDEN') { super(message, 403); }
}
export class NotFoundError extends ClientSideErrors {
    constructor(message = 'NOT_FOUND') { super(message, 404); }
}
export class MethodNotAllowedError extends ClientSideErrors {
    constructor(message = 'METHOD_NOT_ALLOWED') { super(message, 405); }
}
export class ConflictError extends ClientSideErrors {
    constructor(message = 'CONFLICT') { super(message, 409); }
}
export class UnprocessableEntityError extends ClientSideErrors {
    constructor(message = 'UNPROCESSABLE_ENTITY') { super(message, 422); }
}
// Errores 5xx
export class InternalServerError extends ApiError {
    constructor(message = 'INTERNAL_SERVER_ERROR') { super(message, 500); }
}
export class CustomError extends ApiError {
    constructor(message = 'error', status = 500) {
        super(message, status);
    }
}
export function handleError(e) {
    console.error(e);
    if (e instanceof ClientSideErrors)
        throw e;
    throw new InternalServerError();
}
