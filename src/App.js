import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Header from "./components/header";


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="./components/header.js" element={<Header />} /> */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<AboutUs />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
