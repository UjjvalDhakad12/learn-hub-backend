const mongoose = require("mongoose");


//this is userschema kya kya lena hai user se
const userSchema = new mongoose.Schema({
    username: String, 
    email: { type: String, unique: true },
    password: String,
});

//exports kiya hai or mongoose me kis name se save karna hai vo hai
module.exports = mongoose.model("User", userSchema);
