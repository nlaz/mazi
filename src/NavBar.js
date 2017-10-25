import React from "react";
import { PAGE } from "./App";
import "./NavBar.css";

export default function NavBar({ onNavClick }) {
  return (
    <nav className="navbar">
      <div className="container display-flex">
        <div className="navbar-left">
          <a className="navbar-logo">Mazi</a>
        </div>

        <div className="navbar-right">
          <a onClick={() => onNavClick(PAGE.NEW)} className="navbar-link navbar-button">
            Create Bounty
          </a>

          <a onClick={() => onNavClick(PAGE.REQUESTS)} className="navbar-link">
            All Bounties
          </a>
        </div>
      </div>
    </nav>
  );
}
