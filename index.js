const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./router/auth");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

app.use("/api", authRoutes);

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);
