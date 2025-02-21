import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
  } from '@sequelize/core';
  import { Attribute, PrimaryKey, AutoIncrement, NotNull, HasMany } from '@sequelize/core/decorators-legacy';
  import { Project } from './Project';
  
  export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Attribute(DataTypes.INTEGER)
    @AutoIncrement
    @PrimaryKey
    declare id: CreationOptional<number>;
  
    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;
  
    @Attribute(DataTypes.STRING)
    @NotNull
    declare email: string;
  
    @Attribute(DataTypes.STRING)
    @NotNull
    declare password: string;
  
    @Attribute(DataTypes.ENUM('developer', 'manager', 'QA'))
    @NotNull
    declare userType: 'developer' | 'manager' | 'QA';
  
    @HasMany(() => Project, 'managerId')
    declare managedProjects?: NonAttribute<Project[]>;
  }
  export default User;
