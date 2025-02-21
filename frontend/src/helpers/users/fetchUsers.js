
const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            console.log("no auth token available");
            alert("Token is invalid or unavailable");
            return null;
        }
        
        const response = await fetch('http://localhost:5000/api/v1/user/all-users', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const error = await response.json();
            alert("Failed to fetch users. Please try again!");
            throw new Error(error.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error fetching users", error);
        alert("Error fetching users. May be you are Not Authorized ");
        return null;
    }
};
export default fetchUsers;
