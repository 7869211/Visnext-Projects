const addProject = async (formData) => {
    try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            console.log("No auth token available");
            alert("Token is invalid or unavailable");
            return null;
        }


        const response = await fetch(`http://localhost:5000/api/v1/project/create-project`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body:JSON.stringify(formData)

        });

        if (!response.ok) {
            const error = await response.json();
            alert("Failed to create project. Please try again!");
            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error creating project", error);
        alert("Error creating project");
        return null;
    }
};

export default addProject;
