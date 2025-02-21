import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
  } from '@sequelize/core';
  import { Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo, HasMany } from '@sequelize/core/decorators-legacy';
  import { User } from './User';
  import { ProjectAssignment } from './ProjectAssignment';
  import { Bug } from './Bug';
  
  export class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
    @Attribute(DataTypes.INTEGER)
    @AutoIncrement
    @PrimaryKey
    declare id: CreationOptional<number>;
  
    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;
  
    @Attribute(DataTypes.TEXT)
    declare description: string | null;
  
    @BelongsTo(() => User, 'managerId')
    declare manager?: NonAttribute<User>;
  
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare managerId: number;
  
    @HasMany(() => ProjectAssignment, 'projectId')
    declare projectAssignments?: NonAttribute<ProjectAssignment[]>;
  
    @HasMany(() => Bug, 'projectId')
    declare bugs?: NonAttribute<Bug[]>;
  }
  
export default Project;