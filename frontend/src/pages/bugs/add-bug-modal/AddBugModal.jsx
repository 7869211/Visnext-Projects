import React, { useState } from 'react';
import { X, Calendar, Upload ,CircleUserRound} from 'lucide-react';
import PropTypes from 'prop-types';
import './AddBugModal.css';
import createBug from "../../../helpers/bugs/createBug";

const AddBugModal = ({ projectId, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    screenshot: "",
    type: "bug",
    status: "new",
    assignedTo: "",
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      alert("Title is required");
      return;
    }

    try {
      const response = await createBug(formData, projectId);

      if (response?.success) {
        alert("Bug added successfully!");
        onClose();
      } else {
        alert(response?.message || "Failed to add the bug. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while adding the bug.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add new bug</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
          <button className="more-options">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <div className="action-row">
            <div className="assign-section">
              <span>Assign to</span>
              <div className="avatar-group">
                <CircleUserRound size={24} className="avatar" />
                <CircleUserRound size={24} className='avater'/>
                <div className="avatar more">+1</div>
              </div>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Assignee ID"
                className="assignee-input"
              />
            </div>
            <div className="date-section">
              <span>Add due date</span>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="date-input"
              />
              <button className="date-button">
                <Calendar size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Add title here"
              value={formData.title}
              onChange={handleChange}
              className="title-input"
              required
            />

            <div className="details-section">
              <label>Bug details</label>
              <textarea
                name="description"
                placeholder="Add here"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="feature">Feature</option>
                  <option value="bug">Bug</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="new">New</option>
                  <option value="started">Started</option>
                  <option value="completed">Completed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="upload-section">
              <Upload size={20} />
              <p>Drop any file here or <span className="browse-text">browse</span></p>
            </div>

            <div className="modal-footer">
              <button type="submit" className="add-button">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddBugModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddBugModal;

