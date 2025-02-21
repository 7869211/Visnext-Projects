const assignProject =async(projectId,userIds)=>{
    try{
        console.log("pid :",projectId,"uid:",userIds);
        if (!projectId ||!Array.isArray(userIds)) {
            alert("project id or userids are invalid");
            throw new Error("from assignProject::Invalid project ID or user IDs provided");
        }
        const token = localStorage.getItem('auth-token');
        if (!token) {
            console.log("No auth token available");
            alert("Token is invalid or unavailable");
            return null;
        }
        const response = await fetch(`http://localhost:5000/api/v1/project/assignment/${projectId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({userIds})
        });
        if (!response.ok) {
            alert("Failed to assign project to users. Please try again!");
            throw new Error(`Failed to assign project to users: ${response.statusText}`);
        }
        alert("successfully assigned project");
        return await response.json();
    }
    catch(err){
        alert("Failed to assign project to users. Please try again");
        console.error("from assignProject::Error assigning project:", err.message);
        return;
    }
};
export default assignProject;