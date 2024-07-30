import authService from './authService';
import moduleService from './moduleService';
import assignmentService from './assignmentService';
import notificationService from './notificationService';
import friendshipService from './friendshipService';
import profileService from './profileService';
import teamService from './teamService';
import projectService from './projectService';
import projectAssignmentService from './projectAssignmentService';

const ApiService = {
  ...authService,
  ...moduleService,
  ...assignmentService,
  ...notificationService,
  ...friendshipService,
  ...profileService,
  ...teamService,
  ...projectService,
  ...projectAssignmentService,
};

export default ApiService;
