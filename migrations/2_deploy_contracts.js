/* global artifacts */
// var StandardBounties = artifacts.require("../contracts/StandardBounties.sol");
var SimpleBounties = artifacts.require("../contracts/SimpleBounties.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleBounties);
};
