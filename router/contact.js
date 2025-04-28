const express = require('express');
const router = express.Router();
const contact = require('../controller/contact.controller');

//this is contact route
router.post ('/contact', contact.contact);

module.exports = router;