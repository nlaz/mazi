import React, { Component } from "react";
import SimpleStorageContract from "../build/contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";

import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";
import DashboardPage from "./DashboardPage";
import NewPage from "./NewPage";
import RequestsPage from "./RequestsPage";

const PAGE = {
  HOME: "home",
  NEW: "new",
  REQUESTS: "requests"
};

export function Pages({ page, state }) {
  switch (page) {
    case PAGE.HOME:
      return <DashboardPage storageValue={state.storageValue} />;
    case PAGE.NEW:
      return <NewPage />;
    case PAGE.REQUESTS:
      return <RequestsPage />;
    default:
      return <DashboardPage storageValue={state.storageValue} />;
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null,
      page: PAGE.HOME
    };

    this.onNavClick = this.onNavClick.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require("truffle-contract");
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage
        .deployed()
        .then(instance => {
          simpleStorageInstance = instance;

          // Stores a given value, 5 by default.
          return simpleStorageInstance.set(5, { from: accounts[0] });
        })
        .then(result => {
          // Get the value from the contract to prove it worked.
          return simpleStorageInstance.get.call(accounts[0]);
        })
        .then(result => {
          // Update state with the result.
          return this.setState({ storageValue: result.c[0] });
        });
    });
  }

  onNavClick(value) {
    this.setState(() => ({ page: value }));
  }

  render() {
    const { page } = this.state;

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a
            onClick={() => this.onNavClick(PAGE.HOME)}
            className="pure-menu-heading pure-menu-link"
          >
            Truffle Box
          </a>
          <a onClick={() => this.onNavClick(PAGE.NEW)} className="pure-menu-heading pure-menu-link">
            New
          </a>

          <a
            onClick={() => this.onNavClick(PAGE.REQUESTS)}
            className="pure-menu-heading pure-menu-link"
          >
            Requests
          </a>
        </nav>

        <Pages page={page} state={this.state} />
      </div>
    );
  }
}

export default App;
