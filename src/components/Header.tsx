import React from "react";
import { FaRocket } from "react-icons/fa";
import "../styles/Header.css"; // تأكد من إنشاء ملف CSS منفصل للتنسيق

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <h1 className="app-title">
        <FaRocket className="app-icon" /> كالكو - مخططك الجامعي 
      </h1>
      <a href="#" className="course-creator-link">
        الذهاب إلى منشئ المقررات
      </a>
    </header>
  );
};

export default Header;
