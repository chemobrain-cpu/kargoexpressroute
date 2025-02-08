require('dotenv').config();  // Loading environment variables
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const compression = require('compression');
const axios = require('axios');
const { Server } = require('socket.io');

// Import routes
const adminRoutes = require('./routes/admin');
const clientRoutes = require('./routes/client');

// Set view engine and static directory
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware for JSON and URL-encoded body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Setting up express-session
app.use(session({
  secret: "mylittlesecret",
  resave: false,
  saveUninitialized: false,
  name: "precious",
  genid: function () {
    return "prechy";  // Generate a unique session ID
  },
  cookie: {
    maxAge: 7800000000000,  // Set cookie expiration time
  },
}));

// Middleware for removing trailing slashes from URLs
app.use((req, res, next) => {
  if (req.path.slice(-1) === '/' && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});

// Use the imported routes
app.use(adminRoutes.router);
app.use(clientRoutes.router);

// Error handler middleware
app.use((err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 300;
  err.message = err.message;
  res.status(err.statusCode).render("index");
});

// Set up Socket.io server
let server = require('http').createServer(app);


// Listen on the specified port
app.listen(process.env.PORT || 8081, (err) => {
  if (err) console.log(err);
  else console.log("Successfully started on port", process.env.PORT || 8081);
});
