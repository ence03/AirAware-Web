import React from "react";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ErrorPage from "./pages/ErrorPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
