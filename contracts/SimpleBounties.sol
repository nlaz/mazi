pragma solidity ^0.4.15;

contract SimpleBounties {

    struct SimpleBounty {
        address issuer;
        address arbiter;
        uint deadline;
        uint fulfillmentAmount;
        string title;
        string description;
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
      string _title,
      string _description
    ) public payable returns (uint) {
      bounties.push(SimpleBounty(_issuer, _arbiter, _deadline, _fulfillmentAmount, _title, _description));
      BountyIssued(bounties.length - 1);
      return (bounties.length - 1 );
    }

    function getNumBounties() public constant returns (uint) {
      return bounties.length;
    }

    function getBounty(uint _bountyId) public constant returns (address, address, uint, uint, string, string) {
      return (
        bounties[_bountyId].issuer,
        bounties[_bountyId].arbiter,
        bounties[_bountyId].deadline,
        bounties[_bountyId].fulfillmentAmount,
        bounties[_bountyId].title,
        bounties[_bountyId].description
      );
    }
}
