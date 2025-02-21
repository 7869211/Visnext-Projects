const BugConstants = Object.freeze({
    MESSAGES: {
      
    FIELDS_ARE_REQUIRED:"fields are required",
    ERROR_IN_CREATING_BUG: "Error in creating the bug",
    ERROR_IN_GETTING_BUGS_BY_ID: "Error in getting the bugs by it",
    BUGID_AND_STATUS_REQUIRED: "Bug ID and status required",
    ERROR_IN_UPDATING_BUG_STATUS:"Error in updating the bug status",
    ASSIGNEE_AND_PROJECTID_REQUIRED:"Assignee and project ID required",
    ERROR_IN_FINDING_BUGS:"Error in finding bugs in the project",
    } as const
  });
  
  export default BugConstants;
  