import React, { useState, useEffect } from "react";
import fetchAllAssignments from "../../../helpers/projects/fetchAllAssignments";
import "./AllAssignments.css";
const AllAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const data = await fetchAllAssignments();
        
        if (data && data?.success) {
          setAssignments(data.data);
        } else {
          console.error("Error fetching users:", data?.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    loadAssignments();
  }, [assignments]);

  return (
    <div className="assignment-container">
      <div className="header">
        <h2>All Assignments</h2>
        <p className="assignment-count">Total Assignments: {assignments.length}</p>
      </div>
      <div className="table-wrapper">
        <table className="assignment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>UserID</th>
              <th>ProjectID</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.id}</td>
                  <td>{assignment.userId}</td>
                  <td>{assignment.projectId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-assignment">
                  No assignments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAssignments;
