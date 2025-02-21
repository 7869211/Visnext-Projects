import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import addProject from "../../../helpers/projects/addProject";
import { ImagePlus } from 'lucide-react';
import './Add-Project.css';

const AddProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProject = async () => {
    try {
      const response = await addProject(formData);
      if (response) {
        alert("Project added successfully");
        navigate(0); 

        setFormData({
          name: "",
          description: "",
        });
      }
    } catch (error) {
      console.log("Error adding project", error);
      alert("Failed to add project. Please try again!");
    }
  };

  const handleCancelProject = () => {
    navigate(0); 
  };

  return (
    <div className="add-project-modal-container">
      <div className="add-project-modal">
        <h3>Add New Project</h3>
        <div className="form-and-uploadphoto">
              <div className="form-section">
                  <div className="form-field">
                    <label htmlFor="name">Project Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter project name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="description">Short Details</label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Enter short details"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
              </div>
              <div className="upload-section">
                <div className="upload-box">
                  <ImagePlus className="upload-icon" />
                  <p className="upload-text">
                    Upload project<br />photo
                  </p>
                </div>
          </div>
        </div>
        <div className="modal-buttons">
          <button  className="add-modal-btn" onClick={handleAddProject}>Add</button>
          <button className="cancel-modal-btn" onClick={handleCancelProject}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
