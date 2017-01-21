pragma solidity ^0.4.4;

contract SmartNodeWallet {
  address public owner;

  event Deposit(address indexed _from, uint256 _value);
  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  // event Order(address indexed _service, uint256 _value, string _description);

  modifier onlyOwner() {
    if (msg.sender != owner) {
      throw;
    }
    _;
  }

  function transferOwner() onlyOwner {
    owner = msg.sender;
  }

  function send(address _to, uint256 _value) onlyOwner returns (bool success) {
    if (!_to.call.value(_value)()) {
      throw;
    }
    Transfer(this, msg.sender, _value);
  }

  function destroy() onlyOwner {
    selfdestruct(owner);
  }

  function () payable {
    if (msg.value > 0) {
      Deposit(msg.sender, msg.value);
      Transfer(msg.sender, this, msg.value);
    }
  }
}
