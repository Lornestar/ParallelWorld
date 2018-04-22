//var Adoption = artifacts.require("Adoption");
var ParallelWorld = artifacts.require("ParallelWorld");
//var ERC223Token = artifacts.require("ERC223Token");

module.exports = function(deployer) {
  //deployer.deploy(Adoption);
  deployer.deploy(ParallelWorld);
  //deployer.deploy(ERC223Token);
};