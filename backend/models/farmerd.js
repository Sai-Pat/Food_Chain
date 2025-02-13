const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Product Schema
const productSchema = new Schema({
  productName: { type: String, required: true },
  productQuantity: { type: Number, required: true, min: 1 },
  plantingDate: { type: Date, required: true },
  harvestingDate: { type: Date, required: true },
  daysToGrow: { 
    type: Number, 
    required: true, 
    min: 1, 
    set: function(value) { // Auto-calculate daysToGrow based on dates
      const diffTime = Math.abs(new Date(this.harvestingDate) - new Date(this.plantingDate));
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days in milliseconds
    }
  },
});

// Define the Farmer Schema
const farmerSchema = new Schema({
  name: { type: String, required: true },
  aadharId: {
    type: String,
    required: true,
    unique: true,
    minlength: 12,
    maxlength: 12,
    match: /^[0-9]+$/,
  },
  location: { type: String, required: true },
  farmSize: { type: Number, required: true, min: 1 },
  products: {
    type: [productSchema],
    validate: {
      validator: (products) => products.length > 0,
      message: 'A farmer must have at least one product.',
    },
  },
  npopCertification: { type: Boolean, default: false },
});

// Remove numOfProducts and calculate based on the length of the products array
farmerSchema.virtual('numOfProducts').get(function () {
  return this.products.length;
});

// Virtual for calculating days to grow for the whole farm
farmerSchema.virtual('calculatedDaysToGrow').get(function () {
  let totalDays = 0;
  this.products.forEach((product) => {
    totalDays += product.daysToGrow;
  });
  return Math.ceil(totalDays / this.products.length);
});

// Check if the model already exists before defining it
const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;
