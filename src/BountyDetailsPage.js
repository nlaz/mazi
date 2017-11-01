import React from "react";
import moment from "moment";

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
          <div className="submissions-header display-flex">
            <div>
              <h1 className="bountyDetails-pageTitle">Submissions</h1>
              <span className="submissions-count">{submissions.length} responses</span>
            </div>
            <button className="button--primary">Add Submission</button>
          </div>
          <div className="submissions-container">
            {submissions.map((item, key) => <SubmissionItem item={item} key={key} />)}
          </div>
        </div>
      </main>
    );
  }
}
