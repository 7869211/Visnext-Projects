import React, { useState, useEffect } from "react";
import assignProject from "../../../helpers/projects/assignProject";
import { useNavigate } from "react-router-dom";
import fetchUsers from "../../../helpers/users/fetchUsers";
import './AssignProjectModal.css';

const AssignProjectModal = ({ projectId }) => {
  const navigate = useNavigate();
  const [userIds, setUserIds] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        if (data && data.success) {
          setUsers(data.data);
        }
      } catch (error) {
        alert("Error fetching users: " + error.message);
        console.error(error);
      }
    };
    loadUsers();
  }, []);

  const handleCheckboxChange = (userId, isChecked) => {
    setUserIds(isChecked ? [...userIds, userId] : userIds.filter(id => id !== userId));
  };

  const handleAssignTo = () => {
    if (userIds.length === 0) {
      alert("Please select at least one user");
      return;
    }
    console.log("From AssignProjectModal:: User IDs:", userIds, "and Project ID:", projectId);
    assignProject(projectId, userIds);
    navigate('/all-assignments');
    setUserIds([]);
  };

  return (
    <div className="modal-overlay">
      <div className="assign-project-modal">
        <h2 className="assignProject-title">Assign Project To</h2>
        <div className="users-container">
          {users
            .filter(user => user.userType === "QA" || user.userType === "developer")
            .map(user => (
              <div key={user.id} className="user-card">
                <input
                  type="checkbox"
                  value={user.id}
                  onChange={(e) =>
                    handleCheckboxChange(user.id, e.target.checked)
                  }
                />
                <span className="user-id">{user.id}</span>
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.userType}</span>
              </div>
            ))}
        </div>
        <div className="button-group">
          <button className="assign-btn" onClick={handleAssignTo}>
            Assign
          </button>
          <button className="cancel-btn" onClick={() => navigate(0)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignProjectModal;
