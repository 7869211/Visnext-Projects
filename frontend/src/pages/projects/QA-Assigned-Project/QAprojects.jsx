import React, { useState, useEffect } from "react";
import fetchAssignedProjects from "../../../helpers/projects/fetchAssignedProjects";
import AddBugModal from "../../bugs/add-bug-modal/AddBugModal";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./QAprojects.css";

const QAProjects = () => {
  const [projects, setProjects] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null); 
  const [showAddBugModal, setShowAddBugModal] = useState(false); 
  const [selectedProjectId, setSelectedProjectId] = useState(null); 

  const navigate = useNavigate();
  useEffect(() => {
    const loadAssignedProjects = async () => {
      try {
        const data = await fetchAssignedProjects();
        if (data?.success) {
          setProjects(data.data);
        } else {
          console.error("Failed to fetch projects:");
        }
      } catch (error) {
        console.error("Error fetching assigned projects:", error);
      }
    };
    loadAssignedProjects();
  }, []);

    const handleDropdownToggle = (projectId) => {
      setDropdownVisible(dropdownVisible === projectId ? null : projectId);
    };

    const handleAddBug = (projectId) => {
      setSelectedProjectId(projectId);
      setShowAddBugModal(true);
    };
    const handleViewBugs = (projectId) => {
      setSelectedProjectId(projectId);
      navigate(`/all-bugs-listing/${projectId}`);
    };

    const handleCloseModal = () => {
      setShowAddBugModal(false);
      setSelectedProjectId(null);
    };

  return (
    <div>
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
                      <button onClick={() => handleAddBug(project.id)}>Add Bug</button>
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

      {showAddBugModal && (
        <AddBugModal
          projectId={selectedProjectId} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default QAProjects;
