import React from "react";

export default function NewPage({ storageValue }) {
  return (
    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1-1">
          <form className="pure-form">
            <fieldset className="pure-group">
              <input type="text" className="pure-input-1-2" placeholder="A title" />
              <textarea className="pure-input-1-2" placeholder="Textareas work too" />
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
