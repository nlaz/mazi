import React from "react";
import moment from "moment";

import "./BountyDetailsPage.css";

const EXAMPLE_SUBMISSIONS = [
  {
    issuer: "0x782396570dcc0Cb520b5E1661D4a359E3dc00f9e",
    date: new Date(),
    status: "Accepted"
  },
  {
    issuer: "0x782396570dcc0Cb520b5E1661D4a359E3dc00f9e",
    date: new Date(),
    status: "Accepted"
  },
  {
    issuer: "0x782396570dcc0Cb520b5E1661D4a359E3dc00f9e",
    date: new Date(),
    status: "Denied"
  }
];

const EXAMPLE_BOUNTY = {
  title: "Summarize these papers on the blockchain",
  specifications:
    "I need you to read these papers about the blockchain and create a summary. Looking for one page of notes and should contain references to the papers.",
  deadline: new Date(),
  fulfillmentAmount: 0.1,
  issuer: "0x782396570dcc0Cb520b5E1661D4a359E3dc00f9e",
  bountyStage: "Active",
  submissions: EXAMPLE_SUBMISSIONS
};

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
  render() {
    const bounty = EXAMPLE_BOUNTY;
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
          <div className="submissions-header display-flex">
            <div>
              <h1 className="bountyDetails-pageTitle">Submissions</h1>
              <span className="submissions-count">{bounty.submissions.length} responses</span>
            </div>
            <button className="button--primary">Add Submission</button>
          </div>
          <div className="submissions-container">
            {bounty.submissions.map((item, key) => <SubmissionItem item={item} key={key} />)}
          </div>
        </div>
      </main>
    );
  }
}
