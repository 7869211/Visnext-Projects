const deleteProject = async (projectName) => {
    try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            console.log("No auth token available");
            alert("Token is invalid or unavailable");
            return null;
        }

        if (!projectName) {
            console.log("No project name provided");
            alert("Project name is required to delete a project");
            return null;
        }

        const encodedProjectName = encodeURIComponent(projectName);

        const response = await fetch(`http://localhost:5000/api/v1/project/delete-project/${encodedProjectName}`, {
            method: "DELETE", 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            alert("Failed to delete project. Please try again!");
            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error deleting project", error);
        alert("Error deleting project");
        return null;
    }
};

export default deleteProject;
