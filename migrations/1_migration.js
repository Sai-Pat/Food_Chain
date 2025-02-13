const FarmerDataSubmission = artifacts.require("FarmerDataSubmission");

module.exports = function (deployer) {
  deployer.deploy(FarmerDataSubmission);
};
