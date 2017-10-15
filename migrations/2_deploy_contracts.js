var StandardBounties = artifacts.require("../contacts/StandardBounties.sol");
var Escrow = artifacts.require("../contacts/Escrow.sol");


module.exports = function(deployer) {
  deployer.deploy(StandardBounties);
  deployer.deploy(Escrow);
};
