import React from "react";
import "./UserOption.css";

const UserOption = ({ icon, title, description, onClick, isSelected }) => {
  return (
    <div
      className={`user-option ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="user-option-icon">{icon}</div>
      <div className="user-option-content">
        <h3 className="user-option-title">{title}</h3>
        <p className="user-option-description">{description}</p>
      </div>
      {isSelected && (
        <div className="user-option-arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default UserOption;