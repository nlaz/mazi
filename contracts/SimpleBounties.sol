pragma solidity ^0.4.15;

contract SimpleBounties {

    enum BountyStages {
      Active,
      Dead,
      Fulfilled,
      Paid
    }

    struct SimpleBounty {
        address issuer;
        address arbiter;
        uint deadline;
        uint fulfillmentAmount;
        string title;
        string description;
        BountyStages bountyStage;
    }

    struct Fulfillment {
      bool paid;
      bool accepted;
      address fulfiller;
      string data;
    }

    /* Events */
    event BountyIssued(uint bountyId);
    event BountyKilled(uint bountyId);
    event BountyFulfilled(uint bountyId, address fulfiller);
    event FulfillmentAccepted(uint bountyId, address fulfiller);

    /* Storage */
    address public owner;

    SimpleBounty[] public bounties;

    mapping(uint => Fulfillment) fulfillments;

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
    ) payable public returns (bool) {
      bounties.push(SimpleBounty(_issuer, _arbiter, _deadline, _fulfillmentAmount, _title, _description, BountyStages.Active));
      BountyIssued(bounties.length - 1);
      return true;
    }

    function getNumBounties() public constant returns (uint) {
      return bounties.length;
    }

    function getBounty(uint _bountyId) public constant returns (address, address, uint, uint, string, string, uint) {
      return (
        bounties[_bountyId].issuer,
        bounties[_bountyId].arbiter,
        bounties[_bountyId].deadline,
        bounties[_bountyId].fulfillmentAmount,
        bounties[_bountyId].title,
        bounties[_bountyId].description,
        uint(bounties[_bountyId].bountyStage)
      );
    }

    function getFulfillments(uint _bountyId) public constant returns (uint, address, string) {
      return (
        _bountyId,
        fulfillments[_bountyId].fulfiller,
        fulfillments[_bountyId].data
      );
    }

    function killBounty(uint _bountyId) public {
      bounties[_bountyId].bountyStage = BountyStages.Dead;
      BountyKilled(_bountyId);
    }

    function fulfillBounty(uint _bountyId, string _data) public {
      bounties[_bountyId].bountyStage = BountyStages.Fulfilled;
      fulfillments[_bountyId] = Fulfillment(false, false, msg.sender, _data);
      BountyFulfilled(_bountyId, msg.sender);
    }

    function acceptFulfillment(uint _bountyId) public {
      fulfillments[_bountyId].accepted = true;
      fulfillments[_bountyId].fulfiller.transfer(bounties[_bountyId].fulfillmentAmount);
      bounties[_bountyId].bountyStage = BountyStages.Paid;
      FulfillmentAccepted(_bountyId, msg.sender);
    }
}
