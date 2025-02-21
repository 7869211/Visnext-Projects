const findBugsForDeveloper =async(projectId,userId)=>{
    try{
        const token = localStorage.getItem('auth-token');
        if (!token) {
            console.log("No auth token available");
            alert("Token is invalid or unavailable");
            return null;
        }
        
        const response = await fetch(`http://localhost:5000/api/v1/bug/get-bugs-by-ids/${projectId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({userId})
        });
        
        if (!response.ok) {
            throw new Error("Failed to update bug status");
        }
        
        const data = await response.json();
        return data;
    }catch(error){
        console.log(error);
        alert("Failed to fetch bugs for developer");
        return null;
    }
};    

export default findBugsForDeveloper;