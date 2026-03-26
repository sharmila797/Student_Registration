const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const path = require("path");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/students", require("./routes/studentRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));