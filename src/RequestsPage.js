import React from "react";
import moment from "moment";
import getWeb3 from "./utils/getWeb3";
import contract from "truffle-contract";

const SimpleBountiesContract = require("../build/contracts/SimpleBounties.json");

const STAGES = {
  ACTIVE: 0,
  DEAD: 1,
  FULFILLED: 2
};

export function RequestItem({ bounty, index, onFulFullItem }) {
  let input;
  return (
    <div className="pure-u-1">
      <div className="left-div">
        <h2>{bounty.title}</h2>
        <p>{bounty.description}</p>
      </div>
      <div className="right-div">
        <p>{bounty.deadline}</p>
        <p>
          <strong>{bounty.fulfillmentAmount} ETH</strong>
        </p>
        {bounty.bountyStage === STAGES.ACTIVE && <p>Active</p>}
        {bounty.bountyStage === STAGES.DEAD && <p>Cancelled</p>}
        {bounty.bountyStage === STAGES.FULFILLED && <p>Fulfilled</p>}
      </div>
      {bounty.fulfillment ? (
        <div style={{ background: "#ccc" }}>
          <p>{bounty.fulfillment.link}</p>
          <p>{bounty.fulfillment.fulfiller}</p>
        </div>
      ) : (
        <div className="pure-form">
          <div className="pure-group">
            <label htmlFor="link">Research link</label>
            <input
              ref={el => (input = el)}
              name="link"
              type="text"
              className="pure-input-1"
              placeholder="Enter a link to your work"
            />
          </div>
          <button onClick={() => onFulFullItem(index, input.value)} className="pure-button">
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default class RequestPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bounties: [],
      web3: undefined,
      accounts: []
    };

    this.getBounties = this.getBounties.bind(this);
    this.convertBounty = this.convertBounty.bind(this);
    this.onFulFullItem = this.onFulFullItem.bind(this);
    this.onCancelItem = this.onCancelItem.bind(this);
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        results.web3.eth.getAccounts((err, accs) => {
          this.setState(() => ({
            web3: results.web3,
            accounts: accs
          }));
          this.getBounties(results.web3);
        });
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  onFulFullItem(bountyId, value) {
    const { web3, bountiesInstance } = this.state;
    if (web3 && bountiesInstance) {
      bountiesInstance
        .fulfillBounty(bountyId, value)
        .then(result => console.log("fulfillBounty", result));
    }
  }

  onCancelItem(bountyId) {
    const { web3, bountiesInstance } = this.state;
    if (web3 && bountiesInstance) {
      bountiesInstance.killBounty(bountyId).then(result => console.log("killBounty", result));
    }
  }

  getBounties(web3) {
    const simpleBounties = contract(SimpleBountiesContract);
    simpleBounties.setProvider(web3.currentProvider);

    let bountiesInstance;

    simpleBounties
      .deployed()
      .then(instance => {
        bountiesInstance = instance;
        return bountiesInstance.getNumBounties.call();
      })
      .then(size => {
        const arr = [...new Array(parseInt(size, 10))];

        const getBounties = arr.map((_, key) => {
          return bountiesInstance.getBounty.call(key);
        });
        return Promise.all(getBounties);
      })
      .then(results => {
        const bounties = results.map(result => this.convertBounty(result));
        this.setState({
          bounties: bounties,
          bountiesInstance: bountiesInstance
        });
        this.getFulfillments(results.web3);
      });
  }

  getFulfillments(web3) {
    const { bounties, bountiesInstance } = this.state;
    const arr = [...new Array(bounties.length)];

    const getFulfillments = arr.map((_, key) => {
      return bountiesInstance.getFulfillments.call(key);
    });

    Promise.all(getFulfillments).then(results => {
      results.forEach((result, key) => {
        const fulfillment = this.convertFulfillment(result);
        this.setState(state => {
          const { bounties } = state;
          state.bounties[key].fulfillment = fulfillment;
          return { bounties: bounties };
        });
      });
    });
  }

  convertBounty(bounty) {
    const { web3 } = this.state;

    return {
      issuer: bounty[0],
      arbiter: bounty[1],
      deadline: moment(bounty[2].toNumber()).format("ddd MMM M, YYYY"),
      fulfillmentAmount: web3.fromWei(bounty[3].toNumber(), "ether"),
      title: bounty[4],
      description: bounty[5],
      bountyStage: bounty[6].toNumber()
    };
  }

  convertFulfillment(fulfillment) {
    return {
      bountyId: fulfillment[0].toNumber(),
      fulfiller: fulfillment[1],
      link: fulfillment[2]
    };
  }

  render() {
    const { bounties } = this.state;
    console.log("bounties", bounties);
    return (
      <div>
        <main className="container container-style">
          <div className="banner">
            <h1 className="banner-head">
              Find Tasks<br />
            </h1>
          </div>
          <div className="pure-g">
            <div className="pure-u-1-2">
              {bounties.map((bounty, key) => (
                <RequestItem
                  key={key}
                  index={key}
                  onFulFullItem={this.onFulFullItem}
                  bounty={bounty}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }
}
