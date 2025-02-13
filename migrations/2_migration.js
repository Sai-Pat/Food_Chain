const PesticideSeller = artifacts.require("PesticideSeller");

module.exports = function (deployer) {
  deployer.deploy(PesticideSeller);
};
