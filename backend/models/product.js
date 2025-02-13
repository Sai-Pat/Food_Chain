// backend/models/product.js

const mongoose = require('mongoose');

// Define the schema for the product
const productSchema = new mongoose.Schema({
    productName: String,
    location: String,
    farmerAadhar: {
      type: String,
      required: true,
      immutable: false // Ensure this field is not set to `immutable: true`
    },
    aadharId: {
      type: String,
      required: true,
      immutable: false // Ensure this field is not set to `immutable: true`
    },


  
  farmer: {
    aadharId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  productName: { type: String, required: true },
  typeOfSeed: { type: String },
  plantingDate: { type: String },
  pickingDate: { type: String },
  pickingMethod: { type: String, default: null },
  typeOfFarming: { type: String },
  location: { type: String, required: true },
  farmSize: { type: Number },
  npopCertificate: { type: String, default: null },
  pesticidesUsed: { type: String, required: true },
  pesticideQuantity: { type: String, required: true },
  },
  pesticideSeller: {
    pesticideName: { type: String, required: true },
  pesticideType: { type: String, required: true },
  aadharNumber: { type: String, required: true },  // No immutable here
  quantity: { type: Number, required: true },
  farmerName: { type: String, required: true },
  },

  distributor: {
    name: String,
    pickingDate: String,
    aadharId: String,
    location: String,
    vendorname: String,
    

  },

});

const Product = mongoose.model('foodSupplyChain', productSchema);
module.exports = Product;
