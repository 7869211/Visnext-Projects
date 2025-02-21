import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserOption from "../../../components/UserOption/UserOption";
import QA from "../../../assets/QA";
import Developer from "../../../assets/Developer";
import Manager from "../../../assets/Manager";
import "./UserType.css";

const UserType = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const options = [
    {
      icon:<Manager/>,
      title: "Manager",
      description: "Signup as a manager to manage the tasks and bugs.",
      userType: "manager",
    },
    {
      icon:<Developer />,
      title: "Developer",
      description: "Signup as a Developer to assign the relevant task to QA.",
      userType: "developer",
    },
    {
      icon:<QA />,
      title: "QA",
      description: "Signup as a QA to create the bugs and report in tasks.",
      userType: "QA",
    },
  ];

  const handleOptionClick = (value) => {
    setSelectedRole(value);
    if (value === "manager" || value === "developer" || value === "QA") {
      navigate(`/signup/${value}`);
    }
  };

  return (
    <div className="usertype-container">
      <div className="usertype-left">
        <img src="/login.png" alt="Join Us" className="usertype-image" />
      </div>
      <div className="usertype-right">
        <p className="already-have-account">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
        <div className="usertype-content">
          <h2 className="usertype-title">Join Us!</h2>
          <p className="usertype-description">
            To begin this journey, tell us what type of account
            you'd be opening.
          </p>
          <div className="usertype-options">
            {options.map((option) => (
              <UserOption
                key={option.userType}
                icon={option.icon}
                title={option.title}
                description={option.description}
                isSelected={selectedRole === option.userType}
                onClick={() => handleOptionClick(option.userType)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserType;