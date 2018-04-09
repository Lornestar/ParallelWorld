Appinit = {
  
    handleinitinTesting:function(){
      App.contracts.ParallelWorld.deployed().then(function(instance) {
        parallelworldInstance = instance;
  
        var itemlist = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        var itemlist1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        var itemlist2 = [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        var itemlistnames1 = ["UMBC", "Kansas St.", "Kentucky", "Buffalo", "Loyola Chicago", "Tennessee", "Nevada", "Cincinnati", "Xavier", "Florida St.", "Ohio St.", "Gonzaga", "Houston", "Michigan", "Texas A&M", "North Carolina"];
        var itemlistnames2 = ["Villanova", "Alabama", "West Virginia", "Marshall", "Florida", "Texas Tech", "Butler", "Purdue", "Kansas", "Seton Hall", "Clemson", "Auburn", "Syracuse", "Michigan St.", "Rhode Island", "Duke"];

        //parallelworldInstance.setItemRegistry.estimateGas(web3.eth.accounts[0]).then(console.log);  28613 gas amount
        //parallelworldInstance.listMultipleItems.estimateGas(itemlist,1e17,web3.eth.accounts[0],itemlistnames).then(console.log); 3495978 gas amount

        //parallelworldInstance.listMultipleItems.estimateGas(itemlist1,1e17,web3.eth.accounts[0],itemlistnames1).then(console.log);
        //parallelworldInstance.listMultipleItems.estimateGas(itemlist2,1e17,web3.eth.accounts[0],itemlistnames2).then(console.log);

        parallelworldInstance.setItemRegistry(web3.eth.accounts[0], {value:0, from:web3.eth.accounts[0], gas:21e5, gasPrice:29e9});
        parallelworldInstance.listMultipleItems(itemlist1,1e16,web3.eth.accounts[0],itemlistnames1, {value:0, from:web3.eth.accounts[0],gasPrice:200e9, gas:21e5});
        parallelworldInstance.listMultipleItems(itemlist2,1e16,web3.eth.accounts[0],itemlistnames2, {value:0, from:web3.eth.accounts[0],gasPrice:200e9, gas:21e5});
  
        
        // Execute allOf to read team data        
      }).catch(function(err) {
        console.log(err.message);
      });
    }
  
  };
  
  