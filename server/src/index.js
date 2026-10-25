
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "IPL Auction Simulator API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("IPL Auction Simulator Backend 🏏");
});

app.listen(PORT, () => {
  console.log(`🏏 Backend running at http://localhost:${PORT}`);
});
