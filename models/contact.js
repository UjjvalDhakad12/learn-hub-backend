const mongoose = require('mongoose');

//this is user contact form schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    description: String,
})

//exprot contactSchema and make a contact folder in database
module.exports = mongoose.model("Contact", contactSchema)