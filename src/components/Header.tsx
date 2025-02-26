import React from "react";
import { FaRocket } from "react-icons/fa";
import "../styles/Header.css";

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <h1 className="app-title">
        <FaRocket className="app-icon" /> كالكو - مخططك الجامعي 
      </h1>
    </header>
  );
};

export default Header;
