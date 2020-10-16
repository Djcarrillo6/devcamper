const ErrorResponse = require("../utils/ErrorReponse");

const errorHandler = (err, req, res, next) => {

  // store the props from the err object in a variable
  let error = {...err};

  // set the error.message prop to err.message
  error.message = err.message;


  
  // To log the err object and see it's props
  console.log(err);



  /************************Custom Errors********************************************/

  // Error-type: Mongoose bad ObjectId
  if(err.name === 'CastError') {
    const message = `Resource not found with ID of: ${err.value}`;
    error = new ErrorResponse(message, 404);
  };


  // Error-type: Mongoose duplicate key
  if(err.code === 11000) {
    const message = 'Duplicate field value entered!';
    error = new ErrorResponse(message, 400);
  };

  // Error-type: Mongoose validation error
  if(err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  };

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;