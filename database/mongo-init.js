const mongoose = require('mongoose');
const Product = require('./models/product'); // Assuming your schema is in models/product.js
require('dotenv').config();

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully.');

    // Sample Data
    const sampleData = [
      {
        productId: 'PROD001',
        farmer: {
          name: 'John Farmer',
          aadharId: '123456789012',
          productName: 'Wheat',
          typeOfSeed: 'Non-GMO',
          plantingDate: '2024-12-01',
          pickingDate: '2025-01-15',
          pickingMethod: 'Manual',
          farmingType: 'Organic',
          location: 'Village A',
        },
        pesticideSeller: {
          name: 'Pesticide Seller 1',
          aadharId: '234567890123',
          pesticideName: 'Pesticide X',
          pesticideType: 'Organic',
        },
        processor: {
          name: 'Processor 1',
          aadharId: '345678901234',
          location: 'City B',
          packingType: 'Boxes',
          storageType: 'Cold Storage',
          pickingDate: '2025-01-16',
          deliveryDate: '2025-01-20',
        },
        distributor: {
          name: 'Distributor 1',
          aadharId: '456789012345',
          location: 'Warehouse C',
          pickingDate: '2025-01-21',
          deliveryDate: '2025-01-25',
          packingType: 'Boxes',
          storageType: 'Warehouse',
        },
        retailer: {
          name: 'Retailer 1',
          aadharId: '567890123456',
          productName: 'Packaged Wheat',
          pickingDate: '2025-01-26',
          location: 'Store D',
        },
      },
      {
        productId: 'PROD002',
        farmer: {
          name: 'Jane Farmer',
          aadharId: '987654321098',
          productName: 'Corn',
          typeOfSeed: 'Genetically Modified',
          plantingDate: '2024-11-15',
          pickingDate: '2025-01-10',
          pickingMethod: 'Machine',
          farmingType: 'Conventional',
          location: 'Village B',
        },
        // Other stages can be added as needed
      },
    ];

    // Clear existing data
    await Product.deleteMany({});
    console.log('Existing data cleared.');

    // Insert sample data
    await Product.insertMany(sampleData);
    console.log('Sample data inserted successfully.');

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
}

// Call the initialization function
initializeDatabase();
