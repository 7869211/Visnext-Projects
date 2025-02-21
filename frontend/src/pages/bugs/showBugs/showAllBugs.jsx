import React, { useState, useEffect } from 'react';
import showBugs from '../../../helpers/bugs/showBugs';
import updateBugStatus from '../../../helpers/bugs/updateBugStatus'; 
import { MoreVertical } from 'lucide-react';
import { useParams } from 'react-router-dom';
import findBugsForDeveloper from '../../../helpers/bugs/findBugsForDeveloper';
import './showAllBugs.css';
import HeaderOptions from "../../../components/HeaderOptions/HeaderOptions";
import {useNavigate} from 'react-router-dom';
import { Layers, Users ,ChevronDown,MoreHorizontal,Settings} from "lucide-react";
import Logo from "../../../assets/Logo";
import Tasks from "../../../assets/Tasks";
import Manage from "../../../assets/Manage";
import Notification from "../../../assets/Notification";
import Email from "../../../assets/Email";
import TasksFilter from '../../../components/TasksFilter/TasksFilter';
import ViewGrid from "../../../assets/ViewGrid";
import ViewList from "../../../assets/ViewList";
import Funnel from "../../../assets/Funnel";
import SortDesc from "../../../assets/SortDesc";
import DueDate from '../../../assets/DueDate';
const ShowAllBugs = () => {
  const [bugs, setBugs] = useState([]);
  const [selectedBug, setSelectedBug] = useState(null); 
  const { projectId } = useParams();
  const currentUser =localStorage.getItem('userType');
  const userId=localStorage.getItem("userId");

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

  const toggleViews =[
    { icon: <Funnel/>},
    { icon: <SortDesc/>},
    { icon: <ViewGrid/>},
    { icon: <ViewList/>},
  ]
  const filterButtons = [
    { 
      label: 'Subtasks', 
      onClick: () => console.log('Subtasks filter clicked') 
    },
    { 
      label: 'Me', 
      onClick: () => console.log('Me filter clicked') 
    },
    { 
      label: 'Assignees', 
      onClick: () => console.log('Assignees filter clicked') 
    },
  ]
  const navigate = useNavigate();
  useEffect(() => {
    const loadBugs = async () => {
      if(currentUser==='developer'){
        console.log("projectId and userId",projectId,userId);
        const data = await findBugsForDeveloper(projectId,userId);
        if (data && data.success) {
          setBugs(data.data);
        } else {
          console.log('Failed to load bugs for developer');
        }
      }
      else{
      const data = await showBugs(projectId);
      if (data && data.success) {
        setBugs(data.data);
      } else {
        console.log('Failed to load bugs');
      }
    }
    }

    loadBugs();
  }, [currentUser,projectId,userId]);

  const handleSearch=()=>{
    console.log('Searching');

  }

  const handleClickHeaderOptions = (value) => {
    if (value === "Projects") {
      navigate(0);
    } 
     else if(value === "Users") {
      navigate("/all-users");
    }
  };

  const handleStatusChange = async (bugId, newStatus) => {
    try {
      const response = await updateBugStatus(bugId, newStatus); 
      if (response?.success) {
        alert('Bug status updated successfully!');
        setBugs((prevBugs) =>
          prevBugs.map((bug) =>
            bug.id === bugId ? { ...bug, status: newStatus } : bug
          )
        );
      } else {
        alert('Failed to update status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating bug status:', error);
    }
  };

  return (
    <div className="bug-list-container">
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
          <div className='title-setting-section'>
              <div className='title-bugs-section'>
                  <h1 className="bug-list-title">All Bugs listing</h1>
                    <div className='bugs-section'>
                      Bugs
                    </div>

              </div>
                <div className='setting-more-section'>
                    <button className='setting-btn'> <Settings/></button>
                    <button className='more-btn'><MoreHorizontal /></button>
                    {/* <button className='add-task-btn'>+ New Task bug </button> */}
                </div>

          </div>
          <div className='filter-sort-view-section'>
                
            <TasksFilter
              onSearch={handleSearch}
             filterButtons={filterButtons}
             toggleViews={toggleViews}
             />
            
          </div>
            
      <table className="bug-table">
        <thead>
          <tr>
            <th><input type="checkbox"></input></th>
            <th>Bug Details</th>
            <th>|</th>
            <th>State</th>
            <th>|</th>
            <th>Status</th>
            <th>|</th>
            <th>Due Date</th>
            <th>|</th>
            <th>Assigned To</th>
            <th>|</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bugs.length > 0 ? (
            bugs.map((bug) => (
              <tr key={bug.id}>
                <td><input type="checkbox"></input></td>
                <td>{bug.title}</td>
                <td></td>
                <td>{bug.type}</td>
                <td></td>
                <td>{bug.status}</td>
                <td></td>
                {/* <td>{new Date(bug.deadline).toLocaleDateString() || 'N/A'}</td> */}
                <td><DueDate/></td>
                <td></td>
                <td>{bug.assignedTo || 'Unassigned'}</td>
                <td></td>
                <td>
                  {currentUser === 'developer' && (
                    <div className="action-dropdown">
                      <MoreVertical
                        size={20}
                        onClick={() =>
                          setSelectedBug(selectedBug === bug.id ? null : bug.id)
                        }
                      />
                      {selectedBug === bug.id && (
                        <div className="dropdown-menu">
                          {['new', 'started', 'completed', 'resolved'].map(
                            (status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  handleStatusChange(bug.id, status)
                                }
                                className={`dropdown-item ${
                                  status === bug.status ? 'active' : ''
                                }`}
                              >
                                {status}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-bugs">
                No bug created on this project.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShowAllBugs;
