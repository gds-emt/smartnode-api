pragma solidity ^0.4.8;

import 'SNServiceInterface.sol';

/**
 * Wallet for Smart Node clients
 */
contract Wallet {
  address public owner;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event RequestMade(address indexed _service, uint256 indexed _requestId, uint256 _value, string _description);
  event RequestRefunded(address indexed _service, uint256 indexed _requestId, uint256 _value);

  modifier onlyOwner() {
    if (msg.sender != owner) {
      throw;
    }
    _;
  }

  function transferOwner() public onlyOwner {
    owner = msg.sender;
  }

  function Wallet() {
    owner = msg.sender;
  }

  function send(address _to, uint256 _value) public onlyOwner {
    if (!_to.call.value(_value)()) {
      throw;
    }
    Transfer(this, _to, _value);
  }

  function makeRequest(address _service, uint256 _value, string _params, string _description) public onlyOwner returns (bool success) {
    uint256 requestId = SNServiceInterface(_service).make.value(_value)(_params);
    if (requestId >= 0) {
      RequestMade(_service, requestId, _value, _description);
      Transfer(this, _service, _value);
      return true;
    }
  }

  function destroy() public onlyOwner {
    selfdestruct(owner);
  }

  function refundRequest(uint256 _requestId) public payable returns (bool success) {
    RequestRefunded(msg.sender, _requestId, msg.value);
    Transfer(msg.sender, this, msg.value);
    return true;
  }

  function () public payable {
    if (msg.value > 0) {
      Transfer(msg.sender, this, msg.value);
    }
  }
}
