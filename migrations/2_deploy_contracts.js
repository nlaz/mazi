/* global artifacts */
// var StandardBounties = artifacts.require("../contracts/StandardBounties.sol");
var SimpleBounties = artifacts.require("../contracts/SimpleBounties.sol");
var Escrow = artifacts.require("../contracts/Escrow.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleBounties);
  deployer.deploy(Escrow);
};
