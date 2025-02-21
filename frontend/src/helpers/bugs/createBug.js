const createBug = async (formData, projectId) => {
    try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            console.log("No auth token available");
            alert("Token is invalid or unavailable");
            return null;
        }

        const response = await fetch(`http://localhost:5000/api/v1/bug/create-bug/${projectId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",          
                Authorization: `Bearer ${token}`,
              },
            body: JSON.stringify(formData), 
        });

        if (!response.ok) {
            const error = await response.json();
            alert("Failed to create bug. Please try again!");
            throw new Error(error.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error creating bug", error);
        return null;
    }
};

export default createBug;
