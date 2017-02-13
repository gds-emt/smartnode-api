pragma solidity ^0.4.8;

import 'SNServiceInterface.sol';

/**
 * Wallet for Smart Node clients
 */
contract Wallet {
  address public owner;

  event Deposit(address indexed _from, uint256 _value);
  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event RequestMade(address indexed _service, uint256 indexed requestId, uint256 _value, string _description);

  modifier onlyOwner() {
    if (msg.sender != owner) {
      throw;
    }
    _;
  }

  function transferOwner() public onlyOwner {
    owner = msg.sender;
  }

  function send(address _to, uint256 _value) public onlyOwner {
    if (!_to.call.value(_value)()) {
      throw;
    }
    Transfer(this, msg.sender, _value);
  }

  function request(address _service, uint256 _value, string _params, string _description) public onlyOwner {
    uint256 requestId = SNServiceInterface(_service).make.value(_value).gas(30000)(_params);
    if (requestId >= 0) {
      RequestMade(_service, requestId, _value, _description);
      Transfer(this, _service, _value);
    } else {
      throw;
    }
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
