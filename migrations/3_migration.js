const DistributorRegistry = artifacts.require("DistributorRegistry");

module.exports = function (deployer) {
  deployer.deploy(DistributorRegistry);
};
