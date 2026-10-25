
const express = require("express");
const router = express.Router();

const {
  getState,
  placeBid,
  sellPlayer,
  markUnsold,
  nextPlayer,
} = require("../services/auctionService");

router.get("/state", (req, res) => {
  res.json({ success: true, data: getState() });
});

router.post("/bid", (req, res) => {
  try {
    const { teamId } = req.body;
    const data = placeBid(teamId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/sell", (req, res) => {
  try {
    res.json({ success: true, data: sellPlayer() });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/unsold", (req, res) => {
  try {
    res.json({ success: true, data: markUnsold() });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/next", (req, res) => {
  try {
    res.json({ success: true, data: nextPlayer() });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
