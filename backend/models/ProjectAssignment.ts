import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
  } from '@sequelize/core';
  import { Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo } from '@sequelize/core/decorators-legacy';
  import { User } from './User';
  import { Project } from './Project';
import exp from 'constants';
  
  export class ProjectAssignment extends Model<InferAttributes<ProjectAssignment>, InferCreationAttributes<ProjectAssignment>> {
    @Attribute(DataTypes.INTEGER)
    @AutoIncrement
    @PrimaryKey
    declare id: CreationOptional<number>;
  
    @BelongsTo(() => Project, 'projectId')
    declare project?: NonAttribute<Project>;
  
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare projectId: number;
  
    @BelongsTo(() => User, 'userId')
    declare user?: NonAttribute<User>;
  
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: number;
  }
export default ProjectAssignment;