import React from "react";
import getWeb3 from "./utils/getWeb3";
import moment from "moment";
import contract from "truffle-contract";

const SimpleBountiesContract = require("../build/contracts/SimpleBounties.json");
import "./BountyDetailsPage.css";

export function SubmissionItem({ item }) {
  var t = new Date(item.date);
  var formattedDate = moment(t).format("ddd, DD MMMM YYYY");
  return (
    <div className="submissionItem display-flex">
      <div className="submission-details">
        <span>
          Submitter: <span className="address">{item.issuer}</span>
        </span>
        <span>
          Date: <span className="date">{formattedDate}</span>
        </span>
      </div>
      <span className="submission-status">{item.status}</span>
    </div>
  );
}

export default class BountyDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showSubmissionForm: false, web3: undefined, accounts: [] };
    this.onToggleSubmissionForm = this.onToggleSubmissionForm.bind(this);
    this.onBountySubmission = this.onBountySubmission.bind(this);
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

  onToggleSubmissionForm() {
    this.setState(state => ({ showSubmissionForm: !state.showSubmissionForm }));
  }

  onBountySubmission(bountyId, value) {
    const { web3 } = this.state;
    console.log("onBountySubmission", web3);
    if (web3) {
      console.log("💢 onBountySubmission", bountyId, value);
      const simpleBounties = contract(SimpleBountiesContract);
      simpleBounties.setProvider(web3.currentProvider);
      simpleBounties
        .deployed()
        .then(instance => {
          return instance.fulfillBounty(bountyId, value);
        })
        .then(result => console.log("fulfillBounty", result));
    }
  }

  render() {
    const { bounty } = this.props;
    const { submissions = [] } = bounty;
    var t = new Date(bounty.deadline);
    var formattedDeadline = moment(t).format("ddd, DD MMMM YYYY");
    return (
      <main className="BountyDetailsPage">
        <div className="container--narrow">
          <h1 className="bountyDetails-pageTitle">Bounty Details</h1>
          <div className="bountyDetails-container">
            <div className="bountyDetails-header display-flex">
              <div className="paymentInfo">
                <span className="paymentInfo-amount">{bounty.fulfillmentAmount}</span>
                <span className="paymentInfo-type">ETH</span>
              </div>
              <div className="bountyInfo">
                <h3 className="bountyInfo-title">{bounty.title}</h3>
                <div className="bountyInfo-details">
                  <span>
                    Issuer: <span className="issuer">{bounty.issuer}</span>
                  </span>
                  <span>
                    Deadline: <span className="deadline">{formattedDeadline}</span>
                  </span>
                  <span>
                    Status: <span className="status">{bounty.bountyStage}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="bountyDetails-specs">
              <h3 className="specs-title">Specifications</h3>
              <div className="specs-details">{bounty.specifications}</div>
            </div>
          </div>
          {this.state.showSubmissionForm && (
            <div>
              <div className="addSubmission-header">
                <h1 className="bountyDetails-pageTitle">Add Submission</h1>
              </div>
              <div className="addSubmission-container">
                <h3 className="addSubmission-label">Submission Results</h3>
                <textarea
                  ref={c => (this.submission = c)}
                  placeholder="Add your bounty submission here..."
                />
                <button
                  onClick={() => this.onBountySubmission(bounty.id, this.submission.value)}
                  className="button--primary"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
          <div className="submissions-header display-flex">
            <div>
              <h1 className="bountyDetails-pageTitle">Submissions</h1>
              <span className="submissions-count">{submissions.length} responses</span>
            </div>
            {!this.state.showSubmissionForm && (
              <button onClick={this.onToggleSubmissionForm} className="button--primary">
                Add Submission
              </button>
            )}
          </div>
          <div className="submissions-container">
            {submissions.map((item, key) => <SubmissionItem item={item} key={key} />)}
          </div>
        </div>
      </main>
    );
  }
}
