// Error handling utilities

const errorHandler = {
  // Handle database errors
  handleDBError: (err) => {
    if (err.code === 11000) {
      // Duplicate key error
      const field = Object.keys(err.keyValue)[0];
      return { error: `${field} already exists.` };
    }
    
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      const errors = Object.values(err.errors).map(val => val.message);
      return { error: errors.join(', ') };
    }
    
    return { error: 'An error occurred.' };
  },

  // Standard error response
  sendErrorResponse: (res, statusCode, message) => {
    res.status(statusCode).json({
      success: false,
      message,
    });
  },

  // Standard success response
  sendSuccessResponse: (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
      success: true,
      message,
      ...(data && { data }),
    });
  },
};

module.exports = errorHandler;