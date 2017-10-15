import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";

import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";
// import DashboardPage from "./DashboardPage";
import NewBountyPage from "./NewBountyPage";
import RequestsPage from "./RequestsPage";

const PAGE = {
  // HOME: "home",
  NEW: "new",
  REQUESTS: "requests"
};

export function Pages({ page, state }) {
  switch (page) {
    // case PAGE.HOME:
    //   return <DashboardPage storageValue={state.storageValue} />;
    case PAGE.NEW:
      return <NewBountyPage />;
    case PAGE.REQUESTS:
      return <RequestsPage />;
    default:
      return <NewBountyPage />;
      // return <DashboardPage storageValue={state.storageValue} />;
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null,
      page: PAGE.NEW
    };

    this.onNavClick = this.onNavClick.bind(this);
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        results.web3.eth.getAccounts((err, accs) => {
          this.setState(() => ({
            web3: results.web3,
            accounts: accs
          }));
        });
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  onNavClick(value) {
    this.setState(() => ({ page: value }));
  }

  render() {
    const { page } = this.state;

    return (
      <div className="app-style App">
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <nav className="navbar pure-menu-heading pure-menu-horizontal navbar-cutsom">
          <p
            // onClick={() => this.onNavClick(PAGE.HOME)}
            className="pure-menu-heading" //pure-menu-link"
          >
            Mazi
          </p>
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
        <footer className="footer">
          <p>Made with <i className="fa fa-coffee" aria-hidden="true"></i> at ETHWaterloo.</p>
        </footer>
      </div>
    );
  }
}

export default App;
