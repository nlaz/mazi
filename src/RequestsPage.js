import React from "react";
import moment from "moment";
import getWeb3 from "./utils/getWeb3";
import contract from "truffle-contract";

import RequestItem from "./RequestItem";
import "./RequestsPage.css";

const SimpleBountiesContract = require("../build/contracts/SimpleBounties.json");

export default class RequestPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bounties: [],
      searchFilter: "",
      web3: undefined,
      accounts: []
    };

    this.getBounties = this.getBounties.bind(this);
    this.convertBounty = this.convertBounty.bind(this);
    this.onFulFullItem = this.onFulFullItem.bind(this);
    this.onCancelItem = this.onCancelItem.bind(this);
    this.onPayItem = this.onPayItem.bind(this);
    this.onSearch = this.onSearch.bind(this);
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

  onPayItem(bountyId) {
    const { web3, bountiesInstance } = this.state;
    if (web3 && bountiesInstance) {
      bountiesInstance
        .acceptFulfillment(bountyId)
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
    console.log("getBounties", simpleBounties);
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
        console.log("bounties", bounties);
        this.getFulfillments(results.web3);
      });
  }

  getFulfillments(web3) {
    const { bounties, bountiesInstance } = this.state;
    const arr = [...new Array(bounties.length)];

    const getFulfillmentss = arr.map((_, key) => {
      return bountiesInstance.getFulfillments.call(key);
    });

    Promise.all(getFulfillmentss).then(results => {
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
      specifications: bounty[5],
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

  onSearch(e) {
    const value = e.target.value;
    this.setState(() => ({ searchFilter: value }));
  }

  render() {
    const { bounties } = this.state;
    const { searchFilter } = this.state;

    const filteredBounties =
      searchFilter.length > 0
        ? bounties.filter(bounty => bounty.title.toLowerCase().indexOf(searchFilter) !== -1)
        : bounties;

    return (
      <main className="RequestsPage">
        <div className="container--narrow">
          <div className="display-flex">
            <input
              className="searchBar"
              onChange={this.onSearch}
              type="text"
              placeholder="Search for bounties..."
            />
          </div>
          {filteredBounties.length > 0 ? (
            <div className="bountiesList">
              {filteredBounties.map((bounty, key) => (
                <RequestItem
                  key={key}
                  index={key}
                  onFulFullItem={this.onFulFullItem}
                  onPayItem={this.onPayItem}
                  onClick={() => this.props.onBountyClick(bounty)}
                  bounty={bounty}
                />
              ))}
            </div>
          ) : (
            <div className="bountiesList--empty">
              {bounties.length > 0 ? (
                <div>
                  <div className="emoji">🔭</div>
                  <p>Can't find any matching bounties. Try something less specific.</p>
                </div>
              ) : (
                <div>
                  <div className="emoji">👋</div>
                  <p>No bounties available. Be the first to create one</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }
}
