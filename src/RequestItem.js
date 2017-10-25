import React from "react";
import moment from "moment";

import "./RequestItem.css";

export default function RequestItem({ bounty, index, onFulFullItem, onPayItem }) {
  var t = new Date(bounty.deadline);
  var formattedDeadline = moment(t).format("ddd, DD MMMM YYYY");
  return (
    <div className="RequestItem display-flex">
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
        <img
          className="bountyInfo-arrowIcon"
          src={process.env.PUBLIC_URL + "/images/arrow.svg"}
          alt="presentation"
        />
      </div>
    </div>
  );
}
