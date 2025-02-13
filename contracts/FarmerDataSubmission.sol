// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FarmerDataSubmission {
    // Struct to store product details
    struct Product {
        string productName;
        uint256 productQuantity;
        uint256 daysToGrow; // Days taken to grow the crop
    }

    // Struct to store farmer details
    struct Farmer {
        string name;
        string aadharId;
        string location;
        uint256 farmSize;
        bool npopCertified;
        Product[] products; // Array to store multiple products
    }

    // Mapping to store farmer data using Aadhar ID as the key
    mapping(string => Farmer) public farmers;

    // Event to log when farmer data is submitted
    event FarmerDataSubmitted(string aadharId, string name, uint256 timestamp);

    // Function to submit farmer data
    function submitFarmerData(
        string memory name,
        string memory aadharId,
        string memory location,
        uint256 farmSize,
        bool npopCertified,
        string[] memory productNames,
        uint256[] memory productQuantities,
        uint256[] memory daysToGrow
    ) public {
        require(farmers[aadharId].farmSize == 0, "Farmer data already exists!"); // Ensure unique Aadhar ID
        require(
            productNames.length == productQuantities.length &&
            productQuantities.length == daysToGrow.length,
            "Mismatch in product data arrays"
        );

        // Create farmer struct
        Farmer storage farmer = farmers[aadharId];
        farmer.name = name;
        farmer.aadharId = aadharId;
        farmer.location = location;
        farmer.farmSize = farmSize;
        farmer.npopCertified = npopCertified;

        // Add products
        for (uint256 i = 0; i < productNames.length; i++) {
            farmer.products.push(Product({
                productName: productNames[i],
                productQuantity: productQuantities[i],
                daysToGrow: daysToGrow[i]
            }));
        }

        // Emit event
        emit FarmerDataSubmitted(aadharId, name, block.timestamp);
    }

    // Function to fetch farmer data by Aadhar ID
    function getFarmerData(string memory aadharId) public view returns (
        string memory name,
        string memory location,
        uint256 farmSize,
        bool npopCertified,
        Product[] memory products
    ) {
        Farmer storage farmer = farmers[aadharId];
        require(farmer.farmSize != 0, "Farmer not found!");

        return (
            farmer.name,
            farmer.location,
            farmer.farmSize,
            farmer.npopCertified,
            farmer.products
        );
    }
}