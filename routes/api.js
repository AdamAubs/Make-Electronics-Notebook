
// routes/api.js
const express = require('express');
const router = express.Router();
const db = require("../models/index/queries.js");

router.get('/sections', async (req, res) => {
  try {
    const publicSections = await db.getPublicSections();
    res.json(publicSections);
  } catch (err) {
    console.error("Failed to fetch sections", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
