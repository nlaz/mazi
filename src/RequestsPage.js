import React from "react";
import getWeb3 from "./utils/getWeb3";
import contract from "truffle-contract";

const SimpleBountiesContract = require("../build/contracts/SimpleBounties.json");

const convertBounty = bounty => ({
  issuer: bounty[0],
  arbiter: bounty[1],
  deadline: bounty[2].toNumber(),
  fulfillmentAmount: bounty[3].toNumber(),
  title: bounty[4],
  description: bounty[5]
});

export function RequestItem({ bounty }) {
  return (
    <div className="pure-u-1">
      <div className="left-div">
        <h2>{bounty.title}</h2>
        <p>{bounty.description}</p>
      </div>
      <div className="right-div">
        <p>{bounty.deadline}</p>
        <strong>
          <p>{bounty.fulfillmentAmount}</p>
        </strong>
      </div>
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
        const bounties = results.map(result => convertBounty(result));
        this.setState({
          bounties: bounties
        });
      });
  }

  render() {
    const { bounties } = this.state;
    console.log(bounties);
    return (
      <div>
        <main className="container container-style">
          <div className="banner">
              <h1 className="banner-head">
                  Find Tasks<br></br>
              </h1>
          </div>
          <p>text</p>
          <div className="pure-g">
            <div className="pure-u-1-2">
              {bounties.map((bounty, key) => <RequestItem key={key} bounty={bounty} />)}
            </div>
          </div>
        </main>
      </div>
    );
  }
}
