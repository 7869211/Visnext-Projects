const updateProject = async (projectName,formData) => {
    try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            console.log("No auth token available");
            alert("Token is invalid or unavailable");
            return null;
        }

        if (!projectName) {
            console.log("No project name provided");
            alert("Project name is required to update a project");
            return null;
        }

        const encodedProjectName = encodeURIComponent(projectName);

        const response = await fetch(`http://localhost:5000/api/v1/project/update-project/${encodedProjectName}`, {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body:JSON.stringify(formData),
        });

        if (!response.ok) {
            const error = await response.json();
            alert("Failed to update project. Please try again!");
            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error updating project", error);
        alert("Error updating project");
        return null;
    }
};

export default updateProject;
