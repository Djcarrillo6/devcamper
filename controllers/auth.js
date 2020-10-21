const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  // Destructure & extract required fields from the request data object
  const { name, email, password, role } = req.body;


  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role   
  });


  // Calling cookie-parser middleware & sending cookie encased token to client-side
  sendTokenResponse(user, 200, res);
});


// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  // Destructure & extract required fields from the request data object
  const { email, password } = req.body;


  // Validate Email & Password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide anb email and password', 400));
  };


  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  };


  // Check if password matches; returns TRUE or FALSE
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  };
  

  // Calling cookie-parser middleware & sending cookie encased token to client-side
  sendTokenResponse(user, 200, res);
});


// Custom function to get token from model, then create cookie + send response 
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};


// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req-obj due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
});

