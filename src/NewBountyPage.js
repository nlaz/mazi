import React from "react";
import moment from "moment";
import getWeb3 from "./utils/getWeb3";
import contract from "truffle-contract";

const SimpleBountiesContract = require("../build/contracts/SimpleBounties.json");

const deadlineOptions = [
  { label: "One month", value: "oneMonth" },
  { label: "Two months", value: "twoMonths" },
  { label: "Three months", value: "threeMonths" },
  { label: "Four months", value: "fourMonths" }
];

export default class NewBountyPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contract_title: "",
      contract_description: "",
      contract_payout: 0,
      contract_deadline: "oneMonth",
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
    const { contract_title, contract_description, contract_payout, accounts } = this.state;

    const deadLineDate = moment()
      .add(1, "months")
      .unix()
      .toString();

    const payoutStringAmount = this.state.web3.toWei(contract_payout, "ether");

    const simpleBounties = contract(SimpleBountiesContract);
    simpleBounties.setProvider(this.state.web3.currentProvider);

    var bountiesInstance;

    simpleBounties
      .deployed()
      .then(instance => {
        bountiesInstance = instance;
        return bountiesInstance.issueBounty(
          accounts[0],
          accounts[1],
          deadLineDate,
          payoutStringAmount,
          contract_title,
          contract_description,
          { from: accounts[0], value: payoutStringAmount }
        );
      })
      .then(result => {
        return bountiesInstance.getNumBounties.call();
      })
      .then(result => {
        console.log("getNumBounties", result.toString());
      })
      .catch(error => console.log(error));
  }

  onInputChange(event) {
    event.preventDefault();
    const { target } = event;
    this.setState(() => ({ [target.name]: target.value }));
  }

  render() {
    return (
      <main className="container container-style">
         <div className="pure-g">
          <div className="myForm pure-u-1-3">
            <form
              onSubmit={this.onBountySubmit}
              className="pure-form"
              style={{ marginTop: "30px" }}
            >
              <fieldset className="myForm pure-group">
                <label htmlFor="title">Title</label>
                <input
                  name="contract_title"
                  type="text"
                  onChange={this.onInputChange}
                  className="pure-input-1"
                  value={this.state.title}
                  placeholder="Enter a bounty title"
                /><br></br>
                <label htmlFor="description">Description</label>
                <textarea
                  name="contract_description"
                  onChange={this.onInputChange}
                  className="pure-input-1"
                  value={this.state.description}
                  placeholder="Enter a description of your bounty"
                /><br></br>
                <label htmlFor="payout_amount">Payout Amount</label>
                <input
                  name="contract_payout"
                  type="number"
                  onChange={this.onInputChange}
                  className="pure-input-1"
                  value={this.state.payout_amount}
                  placeholder="0 ETH"
                /><br></br>
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
        </div>
        <div className="footer l-box">
            <p>
                <a href="#">Try now</a> for 14 days. No credit card required. Header image courtesy of <a href="http://unsplash.com/">Unsplash</a>.
            </p>
        </div>
      </main>

    );
  }
}
