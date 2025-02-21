const updateBugStatus = async(bugId, status) => {
    try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            console.log("No auth token available");
            alert("Token is invalid or unavailable");
            return null;
        }
        
        const response = await fetch(`http://localhost:5000/api/v1/bug/update-bug-status/${bugId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({status})
        });
        
        if (!response.ok) {
            throw new Error("Failed to update bug status");
        }
        
        const data = await response.json();
        return data;
       
    }catch(error){
        console.error("Error updating bug status: ", error);
        alert("Failed to update bug status");
        return null;
    }
};

export default updateBugStatus;