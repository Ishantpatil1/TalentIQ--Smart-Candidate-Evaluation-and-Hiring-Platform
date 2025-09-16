import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import CandidateProfile from "./CandidateProfile";

export default function CandidateDashboard() {
  const [key, setKey] = useState("home");

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Candidate Dashboard</h2>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="home" title="Home">
          <p>Welcome to your dashboard!</p>
        </Tab>
        <Tab eventKey="jobs" title="Jobs">
          <p>Jobs listing coming soon...</p>
        </Tab>
        <Tab eventKey="applied" title="Applied">
          <p>Applied jobs list coming soon...</p>
        </Tab>
        <Tab eventKey="profile" title="Profile">
          <CandidateProfile />
        </Tab>
      </Tabs>
    </div>
  );
}