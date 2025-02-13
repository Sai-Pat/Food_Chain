const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const QRCode = require('qrcode');

// Import Mongoose models
const Farmer = require('./backend/models/farmerd');
const Pesticide = require('./backend/models/pesticide');
const Distributor = require('./backend/models/distributord');

require('dotenv').config();
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure 'views' folder exists for EJS templates
// Middleware
app.use(bodyParser.json());
app.use(cors());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Routes
const farmerRoutes = require('./backend/routes/farmer');
const pesticideSellerRoutes = require('./backend/routes/pesticideSeller');
const distributorRoutes = require('./backend/routes/distributor');
app.use('/api/farmer', farmerRoutes);
app.use('/api/pesticideSeller', pesticideSellerRoutes);
app.use('/api/distributor', distributorRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
const staticPath = path.join(__dirname, 'frontend');
app.use(express.static(staticPath));
// Serve the Homepage (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});
// QR Code serving middleware
app.use('/qr', express.static(path.join(__dirname, 'frontend', 'qr'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));
// QR Code generation endpoint
app.post('/api/generate-qr', async (req, res) => {
  try {
    const data = req.body;
    const farmerAadhar = data.farmerAadhar; // Assuming the Aadhar number is in the request body
    // Use path parameter format for the QR code
    const qrData = `http://localhost:5000/trace/${farmerAadhar}`;
    // Save to frontend/qr folder
    const qrCodePath = path.join(__dirname, 'frontend', 'qr', `${Date.now()}.png`);
    await QRCode.toFile(qrCodePath, qrData);
    // Return the URL relative to the frontend/qr folder
    res.json({ qrCodeUrl: `/qr/${Date.now()}.png` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code.' });
  }
});
// Trace route (corrected model references)
// Add this route to handle path parameters
app.get('/trace/:farmerAadhar', async (req, res) => {
  const { farmerAadhar } = req.params;
  try {
    // Fetch data for the farmer, pesticide, and distributor using the provided Aadhar number
    const farmer = await Farmer.findOne({ aadharId: farmerAadhar });
    const pesticide = await Pesticide.findOne({ aadharNumber: farmerAadhar });
    const distributor = await Distributor.findOne({ farmerAadhar: farmerAadhar });
    if (!farmer || !pesticide || !distributor) {
      return res.status(404).send("Data not found.");
    }
    // Send the data directly to the trace.html page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Product Traceability</title>
        <link rel="stylesheet" href="styleT.css">
      </head>
      <body>
        <div class="container">
          <h1>Product Origin Details</h1>
          
          <!-- Farmer Details -->
          <div class="section">
            <h2>Farmer Details</h2>
            <p><strong>Name:</strong> ${farmer.name}</p>
            <p><strong>Location:</strong> ${farmer.location}</p>
            <p><strong>Farm Size:</strong> ${farmer.farmSize} acres</p>
            <p><strong>Certification:</strong> ${farmer.npopCertification ? 'NPOP Certified' : 'Standard'}</p>
          </div>

          <!-- Products Information -->
          <div class="section">
            <h2>Products</h2>
            ${farmer.products.length > 0 ? `
              <ul>
                ${farmer.products.map(product => `
                  <li>
                    <strong>Product Name:</strong> ${product.productName}<br>
                    <strong>Quantity:</strong> ${product.productQuantity} units<br>
                    <strong>Growth Period:</strong> ${product.daysToGrow} days
                  </li>
                `).join('')}
              </ul>
            ` : '<p>No products found.</p>'}
          </div>

          <!-- Pesticides Information -->
          <div class="section">
            <h2>Pesticides Used</h2>
            ${pesticide.pesticides.length > 0 ? `
              <ul>
                ${pesticide.pesticides.map(p => `
                  <li>
                    <strong>Name:</strong> ${p.pesticideName}<br>
                    <strong>Type:</strong> ${p.pesticideType}<br>
                    <strong>Quantity:</strong> ${p.quantity} units
                  </li>
                `).join('')}
              </ul>
            ` : '<p>No pesticide data available.</p>'}
          </div>

          <!-- Distributor Details -->
          <div class="section">
            <h2>Distributor Details</h2>
            <p><strong>Distributor Name:</strong> ${distributor.vname}</p>
            <p><strong>Location:</strong> ${distributor.location}</p>
            <p><strong>Product Name:</strong> ${distributor.productName}</p>
            <p><strong>Picking Date:</strong> ${new Date(distributor.pickingDate).toLocaleDateString()}</p>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error while fetching data.");
  }
});
// Existing query parameter route (keep this as well)
app.get('/trace', async (req, res) => {
  const { farmerAadhar } = req.query; // Extract from query parameter
  if (!farmerAadhar) {
    return res.status(400).send("Missing farmer Aadhar.");
  }
  try {
    // Use the imported models with correct casing
    const farmer = await Farmer.findOne({ aadharId: farmerAadhar });
    const pesticide = await Pesticide.findOne({ aadharNumber: farmerAadhar });
    const distributor = await Distributor.findOne({ farmerAadhar });
    if (!farmer || !pesticide || !distributor) {
      return res.status(404).json({ error: "Data not found for this Aadhar number." });
    }
    res.json({ farmer, pesticide, distributor });
  } catch (error) {
    console.error('Error fetching data:', error.message); // Improved error logging
    res.status(500).json({ error: "Server error" });
  }
});
app.use(express.json());
app.post('/api/distributor', (req, res) => {
  const { productName, pickingDate, location, farmerAadhar, vname } = req.body;
  // Generate QR code data
  const qrData = JSON.stringify({ productName, pickingDate, location, farmerAadhar, vname });
  // Save QR code to frontend/qr folder
  const qrCodePath = path.join(__dirname, 'frontend', 'qr', `${farmerAadhar}.png`);
  QRCode.toFile(qrCodePath, qrData, (error) => {
    if (error) {
      console.error("Error generating QR code:", error);
      return res.status(500).json({ error: 'Failed to generate QR code.' });
    }
    // Return the URL of the QR code
    res.json({ qrCodeUrl: `/qr/${farmerAadhar}.png` });
  });
});
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
// Server startup
const PORT = process.env.PORT || 5000;
const serverUrl = `http://localhost:${PORT}`;