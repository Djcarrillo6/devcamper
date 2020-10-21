const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan  = require('morgan');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDb = require('./config/db');

// Load Env Vars
dotenv.config({ path: './config/config.env' });


// Connect to DB
connectDb();

// Route modules
const bootcamp = require('./routes/bootcamp');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const app = express();

// Body parser middleware
app.use(express.json());


// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/bootcamps', bootcamp);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;



const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));



// Handle un-handled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server & exit process
  server.close(() => process.exit(1));

});