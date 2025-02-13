const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const generateQRCode = async (aadhar) => {
  try {
    const qrData = `http://localhost:5000/trace/${aadhar}`; // URL to trace page

    // Save the QR code to 'D:/SIGMA WEB DEV/Food/Food/frontend/qr' directory
    const qrCodePath = path.join('A:', 'Aarambh', 'Food', 'frontend', 'qr', `${aadhar}.png`);
  
    // Ensure the directory exists
    const dir = path.dirname(qrCodePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Generate QR code and save it as an image
    await QRCode.toFile(qrCodePath, qrData);
    console.log("Generated a QRCode..!");

    // Return the relative URL to the QR code image (served from 'frontend/qr')
    return `/frontend/qr/${faadhar}.png`; // Adjusted to reflect the new location

  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

module.exports = generateQRCode;
