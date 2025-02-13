// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DistributorRegistry {
    // Struct to store distributor details
    struct Distributor {
        string productName;
        string pickingDate;
        string location;
        string vendorName;
        bool exists; // Flag to track if distributor exists
    }

    // Mapping to store distributor data using Farmer's Aadhar number as the key
    mapping(string => Distributor) private distributors;

    // Event to log when distributor data is submitted
    event DistributorDataSubmitted(
        string indexed farmerAadhar,
        string productName,
        string pickingDate,
        string location,
        string vendorName
    );

    // Function to submit distributor data
    function submitDistributorData(
        string memory farmerAadhar,
        string memory productName,
        string memory pickingDate,
        string memory location,
        string memory vendorName
    ) public {
        require(!distributors[farmerAadhar].exists, "Distributor data already exists!");

        // Store distributor details
        distributors[farmerAadhar] = Distributor({
            productName: productName,
            pickingDate: pickingDate,
            location: location,
            vendorName: vendorName,
            exists: true
        });

        // Emit event
        emit DistributorDataSubmitted(farmerAadhar, productName, pickingDate, location, vendorName);
    }

    // Function to fetch distributor data using Farmer's Aadhar number
    function getDistributorData(
        string memory farmerAadhar
    ) public view returns (
        string memory productName,
        string memory pickingDate,
        string memory location,
        string memory vendorName
    ) {
        require(distributors[farmerAadhar].exists, "Distributor not found!");

        Distributor storage distributor = distributors[farmerAadhar];
        return (
            distributor.productName,
            distributor.pickingDate,
            distributor.location,
            distributor.vendorName
        );
    }

    // Function to check if distributor exists
    function distributorExists(string memory farmerAadhar) public view returns (bool) {
        return distributors[farmerAadhar].exists;
    }
}
