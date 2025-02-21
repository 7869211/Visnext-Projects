import './App.css';
import UserType from './pages/users/UserType/UserType';
import { Routes, Route } from "react-router-dom";
import SignUp from './pages/users/SignUp/SignUp';
import SignIn from './pages/users/Login/SignIn';
import AllProjects from './pages/projects/All-Projects/All-Projects';
import AllUsers from './pages/users/Show-All-Users/Show-All-Users';
import AllAssignments from './pages/projects/All-Project-Assignments/AllAssignments';
import DeveloperProjects from './pages/projects/Developer-Assigned-Project/DeveloperProjects';
import QAProjects from './pages/projects/QA-Assigned-Project/QAprojects';
import AddBugModal from './pages/bugs/add-bug-modal/AddBugModal';
import ShowAllBugs from './pages/bugs/showBugs/showAllBugs';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<UserType />} />

        <Route path="/signup/:userType" element={<SignUp />} />

        <Route path ="/signin" element={<SignIn/>}/>

        <Route path='/all-projects' element={<AllProjects />}/>

        <Route path='/all-users' element={<AllUsers />}/>

        <Route path='/all-assignments' element={<AllAssignments />}/>

        <Route path='/developer-projects' element={<DeveloperProjects />}/>

        <Route path='/qa-projects' element={<QAProjects />}/>

        <Route path='/add-bug-modal' element={<AddBugModal />}/>

        <Route path='/all-bugs-listing/:projectId' element={<ShowAllBugs />}/>
      </Routes>
    </div>
  );
}

export default App;
