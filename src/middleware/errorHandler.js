const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 11000 && err.keyValue) {
    message = `${Object.keys(err.keyValue)[0]} already exists.`;
    statusCode = 409;
  }
  if (err.name === 'ValidationError' && err.errors) {
    message = Object.values(err.errors).map((e) => e.message).join(', ');
    statusCode = 400;
  }
  if (err.name === 'CastError') {
    message = 'Invalid ID format.';
    statusCode = 400;
  }

  res.status(statusCode).json({ success: false, message });
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };