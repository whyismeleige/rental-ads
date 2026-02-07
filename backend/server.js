require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./database/connectDB");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 8080;

// 2. MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

// 4. ROUTES
const authRoutes = require("./routes/auth.routes");
const listingRoutes = require("./routes/listing.routes");

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    type: "error",
    data: null,
  });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => console.log("Server running on PORT:", PORT));

module.exports = app;