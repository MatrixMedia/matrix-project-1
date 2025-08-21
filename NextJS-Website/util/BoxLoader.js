import React from "react";
import { Table } from "react-bootstrap";

const BoxLoader = () => {
  return (
    <div className="bg-white">
      <Table responsive>
        <thead>
          <tr>
            {Array.from({ length: 3 }).map((_, index) => (
              <th
                key={index}
                className="p-3 position-relative"
                style={{ height: "450px" }}
              >
                <div className="load-wrapper">
                  <div className="activity"></div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
        </tbody>
      </Table>
    </div>
  );
};

export default BoxLoader;
