var Adoption = artifacts.require("Adoption");
var ParallelWorld = artifacts.require("ParallelWorld");

module.exports = function(deployer) {
  //deployer.deploy(Adoption);
  deployer.deploy(ParallelWorld);
};