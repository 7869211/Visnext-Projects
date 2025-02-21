import React, { useState, useEffect } from "react";
import Logo from "../../../assets/Logo";
import HeaderOptions from "../../../components/HeaderOptions/HeaderOptions";
import fetchProjects from "../../../helpers/projects/fetchProjects";
import deleteProject from "../../../helpers/projects/deleteProject";
import { Layers, Users, MoreVertical ,ChevronDown,Search} from "lucide-react";
import AddProject from "../Add-Project/Add-Project";
import UpdateProject from "../Update-Project/Update-Project";
import AssignProjectModal from "../AssignProject/AssignProjectModal";
import "./All-Projects.css";
import { useNavigate } from "react-router-dom";
import Tasks from "../../../assets/Tasks";
import Manage from "../../../assets/Manage";
import Notification from "../../../assets/Notification";
import Email from "../../../assets/Email";
import Logo2 from "../../../assets/Logo2";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [search, setSearch] = useState("");
  const [showaddModal, setShowAddModal] = useState(false);
  const [showupdateModal, setShowUpdateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAssignToModal, setShowAssignToModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();
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

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects();
      if (data && data.success) {
        setProjects(data.data);
      } else {
        console.log("Error: ", data?.message);
      }
    };

    loadProjects();
  }, []);

  const handleUpdateProject = (project) => {
    setSelectedProject(project);
    setShowUpdateModal(true);
  };

  const handleClickHeaderOptions = (value) => {
    if (value === "Projects") {
      navigate(0);
    } 
     else if(value === "Users") {
      navigate("/all-users");
    }
  };

  const handleDropdownToggle = (projectId) => {
    setDropdownVisible(dropdownVisible === projectId ? null : projectId);
  };

  const handleDelete = async (projectName) => {
    try {
      const result = await deleteProject(projectName);
      if (result && result.success) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.name !== projectName)
        );
      } else {
        alert("Failed to delete the project");
      }
    } catch (error) {
      console.error("Error deleting project", error);
      alert("Error deleting project");
    }
  };

  const handleAssignTo = (projectId) => {
    setSelectedProjectId(projectId);
    setShowAssignToModal(true);
  };

  const handleViewBugs = (projectId) => {
    setSelectedProjectId(projectId);
    navigate(`/all-bugs-listing/${projectId}`);
  };

  const handleSearchProject = () => {
    try {
      const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredProjects.length > 0) {
        setProjects(filteredProjects);
      } else {
        alert("No project found with the given name");
      }
    } catch (error) {
      console.error("Error searching project", error);
      alert("Error searching project");
    }
  };

  return (
    <div className="all-projects-container">
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
              onClick={() => handleClickHeaderOptions(option.title)}
            />
          ))}
        </div>
      </div>

      <div className="search-and-add-project">
              <div className="sub-section">
                    <div className="title-description">
                      <h3>Projects</h3>
                        <p>Hi DeVisnext, welcome to ManageBug</p>

                    </div>
                      <div className="search-project">
                              <input
                                type="text"
                                placeholder="Search for projects here..."
                                className="search-input-project"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                              />
                              <button className="search-button" onClick={handleSearchProject}>
                                <Search/>
                              </button>
                      </div>

                        <div className="add-project-container">
                            <button
                              className="add-project-button"
                              onClick={() => setShowAddModal(true)}
                            >
                              + Add Project
                            </button>
                          </div>
                        <div className="sort-by">
                          <div className="sort-by-text">Sort by</div><span className="chevronDown-icon"><ChevronDown size={17}/></span>
                          </div>

                          <div className="my-projects">
                          <div className="my-project-text">My projects</div><span className="chevronDown-icon"><ChevronDown size={17}/></span>
                          </div>
                          <div className="logo2-conotainer">
                            <div className="logo2"><Logo2/></div>
                            </div>
          
              </div>
              
        </div>
       
        

      {showaddModal && <AddProject />}

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
                      <button onClick={() => handleUpdateProject(project)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(project.name)}>
                        Delete
                      </button>
                      <button onClick={() => handleAssignTo(project.id)}>
                        Assign to
                      </button>
                      <button onClick={() => handleViewBugs(project.id)}>
                        View Bugs
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="project-description">{project.description}</p>
              <p className="project-id">PID:{project.id}</p>
              <p className="project-date">
                Created on: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="no-projects-message">No projects available.</p>
        )}
        {showupdateModal && <UpdateProject existingProject={selectedProject} />}
        {showAssignToModal && (
          <AssignProjectModal projectId={selectedProjectId} />
        )}
      </div>
    </div>
  );
};

export default AllProjects;
