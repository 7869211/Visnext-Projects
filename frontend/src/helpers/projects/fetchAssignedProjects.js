const fetchAssignedProjects =async()=>{
    try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            console.log("no auth token available");
            alert("Token is invalid or unavailable");
            return null;
        }
        const userId = localStorage.getItem('userId');
        console.log('fetchassignedproject userid from localstorage', userId);

        const response = await fetch(`http://localhost:5000/api/v1/project/assignment/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            const error = await response.json();
            console.error(`Error: ${error.message}`);
            alert("Failed to fetch assigned projects. Please try again!");
            return null;
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
        alert("Failed to fetch assigned projects. Please try again!");
    }


};
export default fetchAssignedProjects;