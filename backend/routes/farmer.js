// backend/routes/farmer.js
const express = require('express');
const router = express.Router();
const Farmer = require('../models/farmerd');  // Ensure the correct model file is imported

// POST route to save or update farmer data
router.post('/', async (req, res) => {
  try {
    const { aadharId, name } = req.body;

    // Check if required fields are missing
    if (!aadharId || !name) {
      return res.status(400).json({ error: 'Missing required fields (aadharId, name)' });
    }

    // Upsert operation: find by aadharId and update, or create if not found
    const farmer = await Farmer.findOneAndUpdate(
      { aadharId },
      req.body,  // Update the document with the provided data
      { upsert: true, new: true }  // Create new if no match is found, return updated document
    );

    res.status(200).json({
      message: 'Farmer data added successfully',
      farmer,  // Return the updated or created farmer object
    });
  } catch (error) {
    console.error('Error in farmer route:', error);
    res.status(500).json({ error: 'Error processing farmer data' });
  }
});

module.exports = router;
