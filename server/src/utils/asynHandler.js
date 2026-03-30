/**
 * Wraps an async Express route handler to catch errors
 * and forward them to the Express error-handling middleware.
 *
 * @param {Function} requestHandler - Async (req, res, next) => {}
 * @returns {Function} Express middleware
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };