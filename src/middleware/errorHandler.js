module.exports = function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).json({
      code:    err.code    || 'internalError',
      message: err.message || 'Internal server error'
    });
  };