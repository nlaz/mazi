import React from "react";
import moment from "moment";
import getWeb3 from "./utils/getWeb3";
import contract from "truffle-contract";

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
      .then(result => {
        return bountiesInstance.getNumBounties.call();
      });
  }

  onInputChange(event) {
    event.preventDefault();
    const { target } = event;
    this.setState(() => ({ [target.name]: target.value }));
  }

  render() {
    return (
      <main className="NewBountyPage container">
        <div className="myForm pure-u-1-2">
          <form onSubmit={this.onBountySubmit} className="pure-form" style={{ marginTop: "30px" }}>
            <fieldset className="myForm pure-group">
              <label htmlFor="title">Title</label>
              <input
                name="contract_title"
                type="text"
                onChange={this.onInputChange}
                className="pure-input-1"
                value={this.state.title}
                placeholder="Enter a bounty title"
              />
              <br />
              <label htmlFor="description">Description</label>
              <textarea
                name="contract_description"
                onChange={this.onInputChange}
                className="pure-input-1"
                value={this.state.description}
                placeholder="How can Mazi help you?"
              />
              <br />
              <label htmlFor="payout_amount">Payout Amount</label>
              <input
                name="contract_payout"
                type="number"
                onChange={this.onInputChange}
                className="pure-input-1"
                value={this.state.payout_amount}
                placeholder="0 ETH"
              />
              <br />
              <label htmlFor="deadline">Deadline</label>
              <br />
              <select
                name="contract_deadline"
                onChange={this.onInputChange}
                className="pure-input-1"
                value={this.state.deadline}
              >
                {deadlineOptions.map((option, key) => (
                  <option key={key} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </fieldset>

            <button type="submit" className="pure-button pure-input-1-1 pure-button-primary">
              Submit Request
            </button>
          </form>
        </div>
      </main>
    );
  }
}
