const httpStatus = require('http-status')

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor (code, message, status, isPublic) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.message = message
    this.status = status
    this.isPublic = isPublic
    this.isOperational = true // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor.name)
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error code.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor ({code, message, status, isPublic}) {
  // constructor (code = '9002', message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
    super(code || '9002', message, status || httpStatus.INTERNAL_SERVER_ERROR, isPublic || false)
  }
}

class UnauthorizedError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error code.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor ({code, message, status, isPublic}) {
  // constructor (code = '9003', message, status = httpStatus.Unauthorized, isPublic = false) {
    super(code || '9003', message, status || httpStatus.UNAUTHORIZED, isPublic || false)
  }
}
module.exports = { APIError, UnauthorizedError }
