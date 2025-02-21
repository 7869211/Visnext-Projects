const fetchProjects = async () => {
    try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            console.log("no auth token available");
            alert("Token is invalid or unavailable");
            return null;
        }
        
        const response = await fetch('http://localhost:5000/api/v1/project/all-projects', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const error = await response.json();
            alert("Failed to fetch projects!");
            throw new Error(error.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error fetching projects.", error);
        alert("Error fetching projects.May be you are Not Authrorized Person");
        return null;
    }
};
export default fetchProjects;
