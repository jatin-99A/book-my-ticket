class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = "Invalid request data") {
    return new ApiError(400, message);
  }

  static unauthorized(message: string = "Authentication required or invalid credentials") {
    return new ApiError(401, message);
  }

  static forbidden(message: string = "You do not have permission to perform this action") {
    return new ApiError(403, message);
  }

  static conflict(message: string = "Resource already exists or conflict occurred") {
    return new ApiError(409, message);
  }

  static notFound(message: string = "Requested resource was not found") {
    return new ApiError(404, message);
  }

  static internalError(message: string = "Internal server error") {
    return new ApiError(500, message);
  }
}

export default ApiError;