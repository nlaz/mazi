import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";

import "./App.css";
import NewBountyPage from "./NewBountyPage";
import RequestsPage from "./RequestsPage";
import NavBar from "./NavBar";
import Footer from "./Footer";

export const PAGE = {
  NEW: "new",
  REQUESTS: "requests"
};

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
      <div className="App">
        <NavBar onNavClick={this.onNavClick} />
        {page === PAGE.NEW ? <NewBountyPage /> : <RequestsPage />}
        <Footer />
      </div>
    );
  }
}

export default App;
