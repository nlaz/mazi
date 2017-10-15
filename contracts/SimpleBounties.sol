pragma solidity ^0.4.15;

contract SimpleBounties {

    struct SimpleBounty {
        address issuer;
        address arbiter;
        uint deadline;
        uint fulfillmentAmount;
        string data;
    }

    /* Events */
    event BountyIssued(uint bountyId);

    /* Storage */
    address public owner;

    SimpleBounty[] public bounties;

    /* Public functions */
    function SimpleBounties(address _owner) public {
      owner = _owner;
    }

    function issueBounty(
      address _issuer,
      address _arbiter,
      uint _deadline,
      uint _fulfillmentAmount,
      string _data
    ) public payable returns (uint) {
      bounties.push(SimpleBounty(_issuer, _arbiter, _deadline, _fulfillmentAmount, _data));
      BountyIssued(bounties.length - 1);
      return (bounties.length - 1 );
    }

    function getNumBounties() public constant returns (uint) {
      return bounties.length;
    }
}
