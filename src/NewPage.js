import React from "react";

export default function NewPage({ storageValue }) {
  return (
    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1-1">
          <form className="pure-form">
            <fieldset className="pure-group">
              <input type="text" className="pure-input-1-2" placeholder="Your request" />
              <textarea className="pure-input-1-2" placeholder="Detail on your task. (ex. I'd like detail on the best crypto companies in North America, by location)." />
              <input type="text" className="pure-input-1-2" placeholder="Highest price (ex. 1 ETH)" />
              <input type="text" className="pure-input-1-2" placeholder="When do you need this completed by?" />
            </fieldset>

            <button type="submit" className="pure-button pure-input-1-2 pure-button-primary">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
