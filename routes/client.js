const express = require("express");
const router = express.Router();

let gethome = require("../controller/client").gethome;
let getabout = require("../controller/client").getabout;
let getservices = require("../controller/client").getservices;
let getcontact = require("../controller/client").getcontact;
let getgallery = require("../controller/client").getgallery;
let trackResult = require("../controller/client").trackResult;
let track = require("../controller/client").track;

// Define the routes
router.get('/', gethome);
router.get('/about', getabout);
router.get('/services', getservices);
router.get('/contact', getcontact);
router.get('/gallery', getgallery);
router.get('/track', track);
router.post('/track', trackResult);

// Catch-all route for undefined routes (redirect to root)
router.all('*', (req, res) => {
    res.redirect('/');
});

exports.router = router;

