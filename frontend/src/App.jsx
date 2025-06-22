import ProfileBuilder from "./ProfileBuilder";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Analytics from "./Analytics";
import DepthPlan from "./DepthPlan"; // Assuming you have an Analytics component

function App() {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/get_started" replace />} />
        <Route path="/get_started" element={<ProfileBuilder />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/depth-plan" element={<DepthPlan />} />
      </Routes>
    </Router>
  );
}

export default App;