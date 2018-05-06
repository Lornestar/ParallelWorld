Appinit = {
  
    handleinitinTesting:function(){
      App.contracts.ParallelWorld.deployed().then(function(instance) {
        parallelworldInstance = instance;
  
        //var itemlist = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        //var itemlist1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        //var itemlist2 = [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        //var itemlistnames1 = ["UMBC", "Kansas St.", "Kentucky", "Buffalo", "Loyola Chicago", "Tennessee", "Nevada", "Cincinnati", "Xavier", "Florida St.", "Ohio St.", "Gonzaga", "Houston", "Michigan", "Texas A&M", "North Carolina"];
        //var itemlistnames2 = ["Villanova", "Alabama", "West Virginia", "Marshall", "Florida", "Texas Tech", "Butler", "Purdue", "Kansas", "Seton Hall", "Clemson", "Auburn", "Syracuse", "Michigan St.", "Rhode Island", "Duke"];

        //var itemlist1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        //var itemlistnames1 = ["Nashville Predators", "Colorado Avalanche", "Winnipeg Jets", "Minnesota Wild", "Vegas Golden Knights", "LA Kings", "Anaheim Ducks", "San Jose Sharks", "Tampa Bay Lightning", "New Jersey Devils", "Boston Bruins", "Toronto Maple Leafs", "Washington Capitals", "Columbus Blue Jackets", "Pittsburgh Penguins", "Philadelphia Flyers"];
        
        //parallelworldInstance.setItemRegistry.estimateGas(web3.eth.accounts[0]).then(console.log);  28613 gas amount
        //parallelworldInstance.listMultipleItems.estimateGas(itemlist,1e17,web3.eth.accounts[0],itemlistnames).then(console.log); 3495978 gas amount

        //parallelworldInstance.listMultipleItems.estimateGas(itemlist1,1e17,web3.eth.accounts[0],itemlistnames1).then(console.log);
        //parallelworldInstance.listMultipleItems.estimateGas(itemlist2,1e17,web3.eth.accounts[0],itemlistnames2).then(console.log);

        var itemlist1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        var itemlist2 = [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        var itemlistnames1 = ["Russia", "Saudi Arabia", "Egypt", "Uruguay", "Portugal", "Spain", "Morocco", "Iran", "France", "Australia", "Peru", "Denmark", "Argentina", "Iceland", "Croatia", "Nigeria"];
        var itemlistnames2 = ["Brazil", "Switzerland", "Costa Rica", "Serbia", "Germany", "Mexico", "Sweden", "Korea Republic", "Belgium", "Panama", "Tunisia", "England", "Poland", "Senegal", "Colombia", "Japan"];
        var itemlistprice1 = [333e14, 1e15, 666e13, 4e16, 5e16, 14e16, 4e15, 4e15, 18e16, 4e15, 5e15, 125e14, 125e15, 5e15, 333e14, 5e15];        
        //var itemlistprice1 = [1e15, 1e15, 666e13, 4e16, 5e16, 14e16, 4e15, 4e15, 18e16, 4e15, 5e15, 125e14, 125e15, 5e15, 333e14, 5e15];        
        var itemlistprice2 = [2e17, 125e14, 4e15, 666e13, 222e15, 166e14, 125e14, 2e15, 833e14, 1e15, 2e15, 5e16, 25e15, 666e13, 4e16, 666e13];

        parallelworldInstance.setItemRegistry(web3.eth.accounts[0], {value:0, from:web3.eth.accounts[0], gas:21e5, gasPrice:29e9});
        parallelworldInstance.listMultipleItems(itemlist1,itemlistprice1,web3.eth.accounts[0],itemlistnames1, {value:0, from:web3.eth.accounts[0],gasPrice:200e9, gas:21e5});
        parallelworldInstance.listMultipleItems(itemlist2,itemlistprice2,web3.eth.accounts[0],itemlistnames2, {value:0, from:web3.eth.accounts[0],gasPrice:200e9, gas:21e5});
        
        
        // Execute allOf to read team data        
      }).catch(function(err) {
        console.log(err.message);
      });
    },

    handleawardprize:function(itemid){
      App.contracts.ParallelWorld.deployed().then(function(instance) {
        parallelworldInstance = instance;
  
        parallelworldInstance.awardprize(itemid, {value:0, from:web3.eth.accounts[0], gas:21e5, gasPrice:29e9});
        
        // Execute allOf to read team data        
      }).catch(function(err) {
        console.log(err.message);
      });
    },

    handlesetreferraltokencontract:function(parallelworldcontract){
      App.contracts.ParallelWorld.deployed().then(function(instance) {
        parallelworldInstance = instance;
  
        parallelworldInstance.setReferralTokenContract(parallelworldcontract, {value:0, from:web3.eth.accounts[0], gas:21e5, gasPrice:29e9});
        
        // Execute allOf to read team data        
      }).catch(function(err) {
        console.log(err.message);
      });
    },
    
    handlechecktokens:function(ethaddress){
      App.contracts.ERC223Token.deployed().then(function(instance) {
        ERC223TokenInstance = instance;
  
        //get list of all items
        ERC223TokenInstance.getbalanceOf.call(ethaddress).then(function(result){
          console.log(result);
        });
    });
  }
}
