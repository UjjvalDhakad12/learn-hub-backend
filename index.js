const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./router/auth");  //require auth route
const contact = require('./router/contact') // require contact route

dotenv.config(); //use dotenv file in index.js

const app = express();
app.use(express.json());
app.use(cookieParser());

//this is cors and frontend run url
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


//connect mongoose 
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

//use authroute
app.use("/api", authRoutes);
app.use('/api', contact)

//server run on 5000 port use env file server
app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);
