import React from "react";
import getWeb3 from "./utils/getWeb3";
import contract from "truffle-contract";

const SimpleBountiesContract = require("../build/contracts/SimpleBounties.json");

const INDEX = {
  ISSUER: 0,
  ARBITER: 1,
  DEADLINE: 2,
  FULFILLMENT_AMOUNT: 3,
  TITLE: 4,
  DESCRIPTION: 5
};

export function RequestItem({ bounty }) {
  return (
    <div className="pure-u-1">
      <h2>{bounty[INDEX.TITLE]}</h2>
      <p>{bounty[INDEX.DESCRIPTION]}</p>
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
      .then(bounties => {
        this.setState({
          bounties: bounties
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    const { bounties } = this.state;
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-2">
            {bounties.map((bounty, key) => <RequestItem key={key} bounty={bounty} />)}
          </div>
        </div>
      </main>
    );
  }
}
