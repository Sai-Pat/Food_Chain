// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PesticideSeller {

    // Struct to store details about each crop
    struct Crop {
        string name;
        uint256 quantity; // in kg
    }

    // Struct to store details about each pesticide
    struct Pesticide {
        string name;
        uint256 quantity; // in liters
    }

    // Struct to store details about the farmer's data
    struct Farmer {
        string farmerName;
        string aadharNumber;
        bool farmerFilledData;
        Crop[] crops; // Array of crops the farmer is growing
        Pesticide[] pesticides; // Array of pesticides the farmer is using
    }

    // Mapping to store each farmer by their Aadhar number
    mapping(string => Farmer) private farmers;

    // Event to log when farmer data is submitted
    event PesticideSellerDataSubmitted(
        string indexed aadharNumber,
        string farmerName,
        uint256 timestamp
    );

    // Function to submit pesticide seller data
    function submitPesticideSellerData(
        string memory farmerName,
        string memory aadharNumber,
        bool farmerFillData,
        string[] memory cropNames,
        uint256[] memory cropQuantities,
        string[] memory pesticideNames,
        uint256[] memory pesticideQuantities
    ) public {
        // Ensure that the arrays have the same length
        require(cropNames.length == cropQuantities.length, "Crops and quantities mismatch");
        require(pesticideNames.length == pesticideQuantities.length, "Pesticides and quantities mismatch");

        // Create or update the farmer's data
        Farmer storage farmer = farmers[aadharNumber];
        farmer.farmerName = farmerName;
        farmer.aadharNumber = aadharNumber;
        farmer.farmerFilledData = farmerFillData;

        // Store crops data
        delete farmer.crops; // Clear previous data
        for (uint i = 0; i < cropNames.length; i++) {
            farmer.crops.push(Crop({
                name: cropNames[i],
                quantity: cropQuantities[i]
            }));
        }

        // Store pesticides data
        delete farmer.pesticides; // Clear previous data
        for (uint i = 0; i < pesticideNames.length; i++) {
            farmer.pesticides.push(Pesticide({
                name: pesticideNames[i],
                quantity: pesticideQuantities[i]
            }));
        }

        // Emit event when data is saved
        emit PesticideSellerDataSubmitted(aadharNumber, farmerName, block.timestamp);
    }

    // Function to get farmer data by Aadhar number
    function getFarmerData(string memory aadharNumber) public view returns (
        string memory farmerName,
        bool farmerFilledData,
        Crop[] memory crops,
        Pesticide[] memory pesticides
    ) {
        Farmer storage farmer = farmers[aadharNumber];
        return (farmer.farmerName, farmer.farmerFilledData, farmer.crops, farmer.pesticides);
    }

    // Function to check if farmer data exists
    function farmerExists(string memory aadharNumber) public view returns (bool) {
        return bytes(farmers[aadharNumber].aadharNumber).length != 0;
    }
}
