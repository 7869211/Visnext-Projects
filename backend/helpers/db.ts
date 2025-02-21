import { Sequelize } from '@sequelize/core';
import User from '../models/User';
import Project from '../models/Project';
import ProjectAssignment from '../models/ProjectAssignment';
import Bug from '../models/Bug';

export const sequelize = new Sequelize({
  dialect: 'postgres', 
  url: 'postgres://aliasim:1234@localhost:5432/bug-tracking-system-database', 
 models: [User,Project,ProjectAssignment,Bug] 
});



