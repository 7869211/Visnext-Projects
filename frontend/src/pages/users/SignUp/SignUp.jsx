import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ChevronRight } from "lucide-react";
import "./SignUp.css";

const SignUp = () => {
  const { userType } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, userType }));
  }, [userType]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/v1/user/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Failed to sign up, please try again!");
        throw new Error(error.message);
      }

      const data = await response.json();
      console.log("User registered successfully", data);

      navigate("/signin");
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
      <img src="/login.png" alt="sign up" className="signup-image" />
      </div>

      <div className="signup-right">
        <h2 className="signup-title">Sign Up</h2>
        <p className="signup-description">
          Please fill in your information below
        </p>

        <div className="signup-fields">
          <form className="signup-form" onSubmit={handleSignup}>
            <div className="form-group">
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Name"
                  value={formData.name}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>
            <button type="submit" className="signup-button">
              Sign Up
              <div className="chevron-right">
                <ChevronRight />
              </div>
            </button>
          </form>
          <p className="already-have-account-signup">
            Already have an account?{"  "}
            <span>
              <Link to="/signin">Login to your account</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
