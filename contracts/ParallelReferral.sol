pragma solidity ^0.4.9;
 
 /* https://github.com/LykkeCity/EthereumApiDotNetCore/blob/master/src/ContractBuilder/contracts/token/SafeMath.sol */
contract SafeMathToken {
    uint256 constant public MAX_UINT256 =
    0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

    function safeAdd(uint256 x, uint256 y) constant internal returns (uint256 z) {
        if (x > MAX_UINT256 - y) throw;
        return x + y;
    }

    function safeSub(uint256 x, uint256 y) constant internal returns (uint256 z) {
        if (x < y) throw;
        return x - y;
    }

    function safeMul(uint256 x, uint256 y) constant internal returns (uint256 z) {
        if (y == 0) return 0;
        if (x > MAX_UINT256 / y) throw;
        return x * y;
    }

    function safeDiv(uint256 x, uint256 y) constant internal returns (uint256 z) {        
        if (x == 0) return 0;
        if (y == 0) throw;
        return x / y;
    }

}

 contract ContractReceiver {
    function tokenFallback(address _from, uint _value, bytes _data);
}
 
contract ERC223Token is SafeMathToken {
    
  event Transfer(address indexed _from, address indexed _to, uint256 _value, bytes _data);

  mapping(address => uint) balances;
  address[] accountsholdingbalance; //indexing of 0 to length-1 of all accounts holding tokens
  
  string public name    = "ParallelSports";
  string public symbol  = "PLS";
  uint8 public decimals = 18;
  uint256 public totalSupply;
  address private owner;
  mapping (address => bool) private contractadmins; //contract addresses allowed to tell if tokens should be issued

  function ERC223Token()
  {
      owner = msg.sender;
      balances[owner] = 10000000 * (10 ** decimals);
      totalSupply = balances[owner];      
  }
  
  /* Modifiers */
  modifier onlyOwner() {
    require(owner == msg.sender);
    _;
  }

  modifier onlyAdmins() {
    require(contractadmins[msg.sender]);
    _;
  }
  /* Owner */
  function setOwner (address _owner) onlyOwner() public {
    owner = _owner;
  }

  /* Parallel Sports Contracts */
  function setContractsAllowed (address _contract) onlyOwner() public {
    
  }
  
  // Function to access name of token .
  function name() constant returns (string _name) {
      return name;
  }
  // Function to access symbol of token .
  function symbol() constant returns (string _symbol) {
      return symbol;
  }
  // Function to access decimals of token .
  function decimals() constant returns (uint8 _decimals) {
      return decimals;
  }
  // Function to access total supply of tokens .
  function totalSupply() constant returns (uint256 _totalSupply) {
      return totalSupply;
  }
  
  function getbalancepercentageoftotalissued(address tokenholder)public view returns(uint256 _percentageoftotalissued){
      uint tokenissuedamount = totalSupply - balances[owner];
      uint256 percentageoftotalissued = safeDiv(balances[tokenholder], tokenissuedamount);
      return percentageoftotalissued;
  }

  function addaddresstotokenholders(address _address){
      if (balances[_address] == 0)
      {
          accountsholdingbalance.push(_address);
      }
  }

  function addAdmin (address _admin) onlyOwner() public {
    contractadmins[_admin] = true;
  }

  function removeAdmin (address _admin) onlyOwner() public {
    delete contractadmins[_admin];
  }
  
  // Function that is called when a user or another contract wants to transfer funds .
  function transfer(address _to, uint _value, bytes _data, string _custom_fallback) returns (bool success) {
      
    if(isContract(_to)) {
        if (balanceOf(msg.sender) < _value) throw;
        addaddresstotokenholders(_to);
        balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
        balances[_to] = safeAdd(balanceOf(_to), _value);
        assert(_to.call.value(0)(bytes4(sha3(_custom_fallback)), msg.sender, _value, _data));
        Transfer(msg.sender, _to, _value, _data);
        return true;
    }
    else {
        return transferToAddress(_to, _value, _data);
    }
}
  

  // Function that is called when a user or another contract wants to transfer funds .
  function transfer(address _to, uint _value, bytes _data) returns (bool success) {
      
    if(isContract(_to)) {
        return transferToContract(_to, _value, _data);
    }
    else {
        return transferToAddress(_to, _value, _data);
    }
}
  
  // Standard function transfer similar to ERC20 transfer with no _data .
  // Added due to backwards compatibility reasons .
  function transfer(address _to, uint _value) returns (bool success) {
      
    //standard function transfer similar to ERC20 transfer with no _data
    //added due to backwards compatibility reasons
    bytes memory empty;
    if(isContract(_to)) {
        return transferToContract(_to, _value, empty);
    }
    else {
        return transferToAddress(_to, _value, empty);
    }
}

//assemble the given address bytecode. If bytecode exists then the _addr is a contract.
  function isContract(address _addr) private returns (bool is_contract) {
      uint length;
      assembly {
            //retrieve the size of the code on target address, this needs assembly
            length := extcodesize(_addr)
      }
      return (length>0);
    }

  //function that is called when transaction target is an address
  function transferToAddress(address _to, uint _value, bytes _data) private returns (bool success) {
    if (balanceOf(msg.sender) < _value) throw;
    addaddresstotokenholders(_to);
    balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
    balances[_to] = safeAdd(balanceOf(_to), _value);
    Transfer(msg.sender, _to, _value, _data);
    return true;
  }
  
  //function that is called when transaction target is a contract
  function transferToContract(address _to, uint _value, bytes _data) private returns (bool success) {
    if (balanceOf(msg.sender) < _value) throw;
    addaddresstotokenholders(_to);
    balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
    balances[_to] = safeAdd(balanceOf(_to), _value);
    ContractReceiver receiver = ContractReceiver(_to);
    receiver.tokenFallback(msg.sender, _value, _data);
    Transfer(msg.sender, _to, _value, _data);
    return true;
}


  function balanceOf(address _owner) constant returns (uint balance) {
    return balances[_owner];
  }

function getbalanceOf(address _owner) external view returns (uint balance) {
    return balances[_owner];
  }

  function sendreferraltokens(address _to, uint256 _value) returns (bool success) {
    addaddresstotokenholders(_to);
    balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
    balances[_to] = safeAdd(balanceOf(_to), _value);
    bytes memory empty;
    Transfer(msg.sender, _to, _value, empty);
    return true;
  }

  //Airdrop ETH inside the contract to all token holders
  function airdrop() onlyOwner() public{
        //airdrop ETH balance in this contract to all those holding tokens
        //airdrop ETH percentage amounts that equal percentage of token holdings
        uint256 totalairdropping = address(this).balance;
        for(uint i=0;i<accountsholdingbalance.length;i++)
        {
            uint256 _percentagetokensoftotalissued = getbalancepercentageoftotalissued(accountsholdingbalance[i]);
            uint256 _ethamounttosend = safeMul(totalairdropping, _percentagetokensoftotalissued);
            address(accountsholdingbalance[i]).transfer(_ethamounttosend);
        }
  }

}