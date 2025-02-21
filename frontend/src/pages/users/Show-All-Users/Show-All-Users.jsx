import React, { useState, useEffect } from "react";
import fetchUsers from "../../../helpers/users/fetchUsers";
import "./Show-All-Users.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        
        if (data && data?.success) {
          setUsers(data.data);
        } else {
          console.error("Error fetching users:", data?.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="users-container">
      <div className="header">
        <h2>Users</h2>
        <p className="user-count">Total Users: {users.length}</p>
      </div>
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.userType }</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-users">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
