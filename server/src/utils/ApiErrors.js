/**
 * Custom API Error class for consistent error responses.
 * Extends native Error to include HTTP status codes and structured error data.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} [message="Something went wrong"] - Error message
   * @param {Array} [errors=[]] - Array of individual error details
   * @param {string} [stack=""] - Optional stack trace override
   */
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };