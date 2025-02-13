const express = require('express');
const router = express.Router();
const Product = require('../models/distributord');
const generateQRCode = require('../utils/generateQRCode');

// Middleware for input validation
const validateInput = (req, res, next) => {
  const { productName, location, farmerAadhar, vname } = req.body;

  if (!productName || !location || !farmerAadhar || !vname) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  next();
};

// Update distributor data and generate QR code
router.post('/', validateInput, async (req, res) => {
  try {
    const { productName, location, farmerAadhar, vname, ...distributorData } = req.body;

    // Find and update the distributor data
    const product = await Product.findOneAndUpdate(
      { productName, location, farmerAadhar, vname },
      { distributor: distributorData },
      { upsert: true, new: true }
    );

    // Generate QR code with a unique identifier (e.g., farmerAadhar)
    const qrCodeUrl = await generateQRCode(farmerAadhar);

    // Update the product with the QR code path
    product.qrCodePath = qrCodeUrl;
    await product.save();

    res.status(200).json({
      message: 'Distributor data updated successfully and QR code generated',
      product,
      qrCodeUrl,
    });
  } catch (error) {
    console.error('Error in distributor route:', error.stack);  // Detailed logging
    res.status(500).json({ error: 'Error processing distributor data' });
  }
});

module.exports = router;