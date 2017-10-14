import React from "react";

export function RequestItem({ index }) {
  return <div>Request {index}</div>;
}

export default function RequestPage() {
  const requests = [...new Array(12)];
  return (
    <main className="container">
      <div className="pure-g">
        <div className="pure-u-1-1">
          {requests.map((_, key) => <RequestItem key={key} index={key} />)}
        </div>
      </div>
    </main>
  );
}
