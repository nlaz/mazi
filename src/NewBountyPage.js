import React from "react";
import moment from "moment";
import getWeb3 from "./utils/getWeb3";
import contract from "truffle-contract";

import "./NewBountyPage.css";

const SimpleBountiesContract = require("../build/contracts/SimpleBounties.json");

const deadlineOptions = [
  { label: "One month", value: 1 },
  { label: "Two months", value: 2 },
  { label: "Three months", value: 3 }
];

export default class NewBountyPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contract_title: "",
      contract_description: "",
      contract_payout: 0,
      contract_deadline: 1,
      web3: undefined,
      accounts: []
    };

    this.onBountySubmit = this.onBountySubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        results.web3.eth.getAccounts((err, accs) => {
          this.setState({
            web3: results.web3,
            accounts: accs
          });
        });
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  onBountySubmit(e) {
    e.preventDefault();
    const {
      contract_title,
      contract_description,
      contract_payout,
      contract_deadline,
      accounts
    } = this.state;

    const deadLineDate = moment()
      .add(contract_deadline, "month")
      .valueOf()
      .toString();

    const payoutStringAmount = this.state.web3.toWei(contract_payout, "ether");

    const simpleBounties = contract(SimpleBountiesContract);
    simpleBounties.setProvider(this.state.web3.currentProvider);
    const account = accounts[0] || "0x0";

    var bountiesInstance;

    simpleBounties
      .deployed()
      .then(instance => {
        bountiesInstance = instance;
        return bountiesInstance.issueBounty(
          account,
          account,
          deadLineDate,
          payoutStringAmount,
          contract_title,
          contract_description,
          { from: accounts[0], value: payoutStringAmount }
        );
      })
      .then(() => {
        return this.props.onBountyCreate();
      });
  }

  onInputChange(event) {
    event.preventDefault();
    const { target } = event;
    this.setState(() => ({ [target.name]: target.value }));
  }

  render() {
    const { currentAddress } = this.props;
    return (
      <main className="NewBountyPage">
        <div className="container--narrow">
          <h1 className="newBounty-pageTitle">Create Bounty</h1>
          {currentAddress && (
            <div className="newBounty-userInfo">
              Current Address: <span className="address">{currentAddress}</span>
            </div>
          )}
          <form className="newBounty-form" onSubmit={this.onBountySubmit}>
            <div className="formGroup">
              <label htmlFor="title">Bounty title</label>
              <input
                name="contract_title"
                type="text"
                onChange={this.onInputChange}
                className="formInput"
                value={this.state.title}
                placeholder="Add a bounty title…"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="description">Bounty specifications</label>
              <textarea
                name="contract_description"
                onChange={this.onInputChange}
                className="formInput"
                value={this.state.description}
                placeholder="Add some bounty specifications…"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="payout_amount">Payout amount</label>
              <input
                name="contract_payout"
                type="number"
                step="0.01"
                onChange={this.onInputChange}
                className="formInput"
                value={this.state.payout_amount}
                placeholder="0.1 ETH"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="deadline">Deadline</label>
              <select
                name="contract_deadline"
                onChange={this.onInputChange}
                className="formInput"
                value={this.state.deadline}
              >
                {deadlineOptions.map((option, key) => (
                  <option key={key} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="newBounty-submit button--primary">
              Create
            </button>
          </form>
        </div>
      </main>
    );
  }
}
