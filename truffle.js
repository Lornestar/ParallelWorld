module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
    /*rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0xc724055D7e9E5A120C81cA49F90354CE6353e1F9", // default address for Rinkeby
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    }*/
  }
};
