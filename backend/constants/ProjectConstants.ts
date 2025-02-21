const ProjectConstants = Object.freeze({
    MESSAGES: {
      
     PROJECT_ALREADY_EXIST:"project already exist try bew one",
     FAILED_TO_CREATE_A_PROJECT:"failed to create a project",
     FAILED_TO_DELETE_A_PROJECT:"failed to DELETE a project",
     FAILED_TO_UPDATE_A_PROJECT:"failed to update a project",
    PROJECT_NOT_FOUND:"project not found",
     SOMETHING_WENT_WRONG:"somrthing went wrong!",
     PROJECT_DOES_NOT_EXIST:"project does not exist",
     USER_OR_PROJECT_IDS_ARE_INVALID:"user or project ids are invalid",
     FAILED_TO_ASSIGN_PROJECT:"failed to assign project",
     NO_PROJECT_ASSIGNED:"no project assigned",
     FAILED_TO_GET_ASSIGNED_PROJECTS:"failed to get assigned projects",
    } as const
  });
  
  export default ProjectConstants;
  