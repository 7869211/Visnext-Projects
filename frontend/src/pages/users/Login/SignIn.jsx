import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ChevronRight } from "lucide-react";
import "./SignIn.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/v1/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log("user already exists", error);
        alert("Failed to sign in, please try again!");
        throw new Error(error.message);
      }

      const data = await response.json();
      const { token, user } = data;

      localStorage.setItem("auth-token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userType", user.userType);

      if (user.userType === "developer") {
        navigate(`/developer-projects`);
      } else if (user.userType === "QA") {
        navigate(`/qa-projects`);
      } else {
        navigate(`/all-projects`);
      }

      console.log("User signed in successfully", data, token);
      alert("Successfully signed in!");
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <img src="/login.png" alt="Sign In" className="signin-image" />
      </div>

      <div className="signin-right">
        <h2 className="signin-title">Login</h2>
        <p className="signin-description">Please enter your login details</p>

        <div className="signin-fields">
          <form className="signin-form" onSubmit={handleSignIn}>
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
              Sign In
              <div className="chevron-right">
                <ChevronRight />
              </div>
            </button>
          </form>
          <p className="already-have-account-signup">
            Don't have an account?{" "}
            <span>
              <Link to="/">Create your account</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
