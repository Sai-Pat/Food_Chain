const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the distributor
const distributorSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing spaces
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    farmerAadhar: {
      type: String,
      required: true,
      unique: true, // Ensure each Aadhar number is unique
      validate: {
        validator: function(v) {
          return /\d{12}/.test(v); // Validate that Aadhar is a 12-digit number
        },
        message: props => `${props.value} is not a valid Aadhar number!`,
      },
    },
    vname: {
      type: String,
      required: true,
      trim: true,
    },
    distributor: {
      type: Map,
      of: Schema.Types.Mixed, // Can store any key-value pair for distributor data
    },
    qrCodePath: {
      type: String,
      default: '', // Store the generated QR code path if applicable
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Create a model for the distributor
const distributors = mongoose.model('distributors', distributorSchema);

module.exports = distributors;
