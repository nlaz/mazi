import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";

import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";
import NewBountyPage from "./NewBountyPage";
import RequestsPage from "./RequestsPage";

const PAGE = {
  NEW: "new",
  REQUESTS: "requests"
};

export function Pages({ page, state }) {
  switch (page) {
    case PAGE.NEW:
      return <NewBountyPage />;
    case PAGE.REQUESTS:
      return <RequestsPage />;
    default:
      return <RequestsPage />;
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null,
      page: PAGE.REQUESTS
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
      <div className="App">
        <nav className="navbar pure-menu-heading pure-menu-horizontal">
          <a
            className="pure-menu-heading pure-menu-link"
            onClick={() => this.onNavClick(PAGE.HOME)}
          >
            Mazi Home
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
