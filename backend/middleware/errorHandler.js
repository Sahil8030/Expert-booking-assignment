export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const isProd = process.env.NODE_ENV === 'production';

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid identifier',
      errors: [],
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message:
        'This slot is no longer available. Please choose another.',
      errors: [],
    });
  }

  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors || {}).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }));
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  const status = err.statusCode || err.status || 500;
  const message =
    err.message && typeof err.message === 'string'
      ? err.message
      : 'Internal server error';

  const body = {
    success: false,
    message: status === 500 && isProd ? 'Internal server error' : message,
    errors: Array.isArray(err.errors) ? err.errors : [],
  };

  if (!isProd && status === 500 && err.stack) {
    body.stack = err.stack;
  }

  res.status(status === 500 ? 500 : status).json(body);
}
