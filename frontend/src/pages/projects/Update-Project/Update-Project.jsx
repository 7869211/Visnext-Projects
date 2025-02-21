import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import updateProject from "../../../helpers/projects/updateProject";
import './Update-Project.css';

const UpdateProject = ({existingProject}) => {
  const [formData, setFormData] = useState({
    name: "",
    description:"",
  });
  const navigate = useNavigate();

  useEffect(()=>{
    if(existingProject){
        setFormData(existingProject);
      } 
    },[existingProject]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProject = async () => {
    try {
      const response = await updateProject(formData.name,formData);
      if (response) {
        alert("Project updated successfully");
        navigate(0); 

        setFormData({
          name: "",
          description: "",
        });
      }
    } catch (error) {
      console.log("Error updating project", error);
      alert("Failed to update project. Please try again!");
    }
  };

  const handleCancelProject = () => {
    navigate(0); 
  };

  return (
    <div className="add-project-modal-container">
      <div className="add-project-modal">
        <h3>Update Project</h3>
        <div className="form-field">
          <label htmlFor="name">Project Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="form-field">
          <label htmlFor="description">Short Details</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="modal-buttons">
          <button onClick={handleUpdateProject}>Update</button>
          <button onClick={handleCancelProject}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;
