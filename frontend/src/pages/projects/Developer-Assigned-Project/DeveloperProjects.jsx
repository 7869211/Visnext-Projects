import React, { useState, useEffect } from 'react';
import fetchAssignedProjects from '../../../helpers/projects/fetchAssignedProjects';
import './DeveloperProjects.css';
import { useNavigate } from 'react-router-dom';
import Tasks from "../../../assets/Tasks";
import Manage from "../../../assets/Manage";
import Notification from "../../../assets/Notification";
import Email from "../../../assets/Email";
import { Layers, Users, MoreVertical ,ChevronDown} from "lucide-react";
import HeaderOptions from '../../../components/HeaderOptions/HeaderOptions';
import Logo from '../../../assets/Logo';
const DeveloperProjects = () => {
  const [projects, setProjects] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null); 


  const options = [
    { icon: <Layers />, title: "Projects" },
    { icon: <Tasks />, title: "Tasks" },
    { icon: <Manage />, title: "Manage" },
    { icon: <Users />, title: "Users" },
    { icon: <Notification />, title: "" },
    { icon: <Email />, title: "" },
    { icon: <img src="/dev.png" alt="Dev" className="Dev-image" /> , title: "Dev." },
    { icon: <ChevronDown />, title: "" },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    const loadAssignedProjects = async () => {
      try {
        const data = await fetchAssignedProjects();
        if (data?.success) {
          setProjects(data.data);
        } else {
          console.error('Failed to fetch projects:');
        }
      } catch (error) {
        console.error('Error fetching assigned projects:', error);
      }
    };
    loadAssignedProjects();
  },[]); 
  const handleDropdownToggle = (projectId) => {
    setDropdownVisible(dropdownVisible === projectId ? null : projectId);
  };


  const handleViewBugs = (projectId) => {
    navigate(`/all-bugs-listing/${projectId}`);
  };
  return (
    <div>
       <div className="logo-and-header">
        <div className="logo-container">
          <Logo />
        </div>
        <div className="header-options-container">
          {options.map((option, index) => (
            <HeaderOptions
              key={index}
              icon={option.icon}
              title={option.title}
              onClick={() => console.log("clicked")}  />
          ))}
        </div>
      </div>
      <h2 className="assignedProject-title">Assigned Projects</h2>
      <div className="projects-container">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3 className="project-title">{project.name}</h3>
                <div
                  className="more-icon"
                  onClick={() => handleDropdownToggle(project.id)}
                >
                  <MoreVertical />
                  {dropdownVisible === project.id && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleViewBugs(project.id)}>View Bugs</button>

                    </div>
                  )}
                </div>
              </div>
              <p className="project-description">{project.description}</p>
              <p className="project-id">PID: {project.id}</p>
             
            </div>
          ))
        ) : (
          <p className="no-projects-message">No projects assigned yet.</p>
        )}
      </div>
    </div>
  );
};
export default DeveloperProjects;