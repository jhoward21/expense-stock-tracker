import React from "react";

function TransactionList() {
  return (
    <>
      <h3>History</h3>
      <ul id="list" className="list">
        <li className="minus">
            Cash <span>-$400</span><button className="btn btn-primary">x</button>
        </li>
      </ul>
    </>
  );
}

export default TransactionList;
