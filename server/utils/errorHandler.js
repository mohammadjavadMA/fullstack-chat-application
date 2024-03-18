const errorHandler = (error, req, res, next) => {
  if (error.statusCode) {
    const statusCode = error.statusCode;
    const message = error.message;
    const data = error.data;
    res.status(statusCode).json({ message, data });
  } else {
    const statusCode = 400;
    const message = error.message;
    const data = error.data;
    res.status(statusCode).json({ message, data });
  }
};

module.exports = errorHandler;
