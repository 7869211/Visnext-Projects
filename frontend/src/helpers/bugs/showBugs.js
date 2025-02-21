const showBugs =async(projectId)=>{
    const token =localStorage.getItem('auth-token');
    if (!token) {
        console.log("No auth token available");
        alert("Token is invalid or unavailable");
        return null;
    }
    try{
        const response = await fetch(`http://localhost:5000/api/v1/bug/get-bugs-by-project/${projectId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error(`error in fetching the bugs! status: ${response.status}`);
        }
        const bugs = await response.json();
        console.log(bugs);
        return bugs;
    }catch (err) {
        console.error("Error fetching bugs:", err.message);
        alert("Failed to fetch bugs. Please try again!");
        return null;
    }

};
export default showBugs;