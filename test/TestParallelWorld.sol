pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ParallelWorld.sol";

contract TestParallelWorld {
    ParallelWorld parallelworld = ParallelWorld(DeployedAddresses.ParallelWorld());
/*
    function testgetowner() public{
        address expected = this;
        
        address testowner = parallelworld.getOwner();

        Assert.equal(testowner, expected, "Owner of contract2");
    }

    function testsetItemRegistry() public{        
        parallelworld.setItemRegistry(msg.sender);
    }

    /*
    // Testing the adopt() function
    function testUserCanAdoptPet() public {
        uint returnedId = adoption.adopt(8);

        uint expected = 8;

        Assert.equal(returnedId, expected, "Adoption of pet ID 8 should be recorded.");
    }

    // Testing retrieval of a single pet's owner
    function testGetAdopterAddressByPetId() public {
        // Expected owner is this contract
        address expected = this;

        address adopter = adoption.adopters(8);

        Assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded.");
    }

    // Testing retrieval of all pet owners
    function testGetAdopterAddressByPetIdInArray() public {
        // Expected owner is this contract
        address expected = this;

        // Store adopters in memory rather than contract's storage
        address[16] memory adopters = adoption.getAdopters();

        Assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded.");
    }*/

}