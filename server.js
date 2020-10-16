const express = require('express');
const dotenv = require('dotenv');
const morgan  = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDb = require('./config/db');

// Load Env Vars
dotenv.config({ path: './config/config.env' });


// Connect to DB
connectDb();

// Route modules
const bootcamp = require('./routes/bootcamp');

const app = express();

// Body parser middleware
app.use(express.json());


// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

// Mount Routers
app.use('/api/v1/bootcamps', bootcamp);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;



const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));



// Handle un-handled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server & exit process
  server.close(() => process.exit(1));

});