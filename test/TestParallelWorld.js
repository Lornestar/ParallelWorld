var ParallelWorld = artifacts.require("./contracts/ParallelWorld.sol");
//var itemlist = [0,1,2,3,4];
//var itemlistnames = ["Villanova", "Duke", "North Carolina", "UCLA", "Baylor"]
var itemlist = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
var itemlist1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var itemlist2 = [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
var itemlistnames1 = ["UMBC", "Kansas St.", "Kentucky", "Buffalo", "Loyola Chicago", "Tennessee", "Nevada", "Cincinnati", "Xavier", "Florida St.", "Ohio St.", "Gonzaga", "Houston", "Michigan", "Texas A&M", "North Carolina"];
var itemlistnames2 = ["Villanova", "Alabama", "West Virginia", "Marshall", "Florida", "Texas Tech", "Butler", "Purdue", "Kansas", "Seton Hall", "Clemson", "Auburn", "Syracuse", "Michigan St.", "Rhode Island", "Duke"];

function outputprizeamount(instance){
    instance.getprizeamount.call().then(function(result)
    {
        console.log("Prize amount = " + result);
    });
}

contract('ParallelWorld', function(accounts) {    
    it("setItemRegistry", function() {
        return ParallelWorld.deployed().then(function(instance) {
            
            instance.setItemRegistry(web3.eth.accounts[0], {value:0, from:web3.eth.accounts[0], gas:21e5, gasPrice:29e9});
            //instance.setItemRegistry.call(web3.eth.accounts[0]);
        });
    });
    it("listMultipleItems", function() {
        return ParallelWorld.deployed().then(function(instance) {
            //instance.listMultipleItems(itemlist,1e17,web3.eth.accounts[0],itemlistnames, {value:0, from:web3.eth.accounts[0], gas:21e5});            
            //outputprizeamount(instance);
            //instance.listItem(1,12324567898900,web3.eth.accounts[0],"Villanova", {value:0, from:web3.eth.accounts[0], gas:21e4});
            instance.listMultipleItems(itemlist1,1e16,web3.eth.accounts[0],itemlistnames1, {value:0, from:web3.eth.accounts[0],gasPrice:200e9, gas:21e5});
            instance.listMultipleItems(itemlist2,1e16,web3.eth.accounts[0],itemlistnames2, {value:0, from:web3.eth.accounts[0],gasPrice:200e9, gas:21e5});
        });
    });
    it("View blockchain results", function() {
        return ParallelWorld.deployed().then(function(instance) {            
            instance.allOf.call(0).then(console.log);
            instance.allOf.call(1).then(console.log);
            instance.allOf.call(2).then(console.log);
            instance.allOf.call(3).then(console.log);
            instance.allOf.call(4).then(console.log);            
        });
    });
    it("View All Info results", function() {
        return ParallelWorld.deployed().then(function(instance) {            
            instance.getlistedItems.call().then(console.log);
        });
    });
    it("Test buy 1", function() {
        return ParallelWorld.deployed().then(function(instance) {
            instance.buy(0, {value:2e17, from:web3.eth.accounts[1], gas:21e4}).then(function(){
                
                
            });
            instance.allOf.call(0).then(function(result){ console.log("After buy 1" + result);});
            outputprizeamount(instance);
        });
    });
    it("Test buy 2", function() {
        return ParallelWorld.deployed().then(function(instance) {
            instance.buy(0, {value:21052631578947368, from:web3.eth.accounts[2], gas:21e4}).then(function(){
                
                
            });
            instance.allOf.call(0).then(function(result){ console.log("After buy 2" + result);});
            outputprizeamount(instance);
        });
    });
    it("Test buy 3", function() {
        return ParallelWorld.deployed().then(function(instance) {
            instance.buy(0, {value:29605263157894736, from:web3.eth.accounts[0], gas:21e4}).then(function(){                                
            });
            instance.allOf.call(0).then(function(result){ console.log("After buy 3" + result);});
            outputprizeamount(instance);
        });
    });
    it("Withdraw all", function() {
        return ParallelWorld.deployed().then(function(instance) {
            /*instance.awardprize(0).then(function(){
                instance.allOf.call(0).then(function(result){ console.log("After award prize" + result);});                
            });
            */
        });
    });
});