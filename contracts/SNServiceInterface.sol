pragma solidity ^0.4.8;

/**
 * Smart Node Standard Service Interface
 */
contract SNServiceInterface {
  /**
   * State values
   * (Services are free to define additional state values)
   * ============
   * 10: new
   * 20: processing (optional, may not be updated by service during processing)
   *
   * [ FINAL STATES >= 50, no more changes allowed to a request once state >= 50 ]
   * 50: complete, success
   * 60: complete, rejected or failed
   */
  event NewRequest(uint256 indexed _id, address indexed _client, string _params);
  event RequestUpdate(uint256 indexed _id, uint8 _state, uint256 _balance);


  /**
   * @return Minimum ETH required to make a request
   */
  function minEthPerRequest() constant returns (uint256 minEth) {}

  /**
   * Make a new request
   */
  function make(string _params) public payable returns (uint256 requestId) {}

  /**
   * The only payable method is make()
   */
  function () {}
}
