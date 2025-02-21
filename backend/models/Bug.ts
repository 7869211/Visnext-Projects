import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
  } from '@sequelize/core';
  import { Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo } from '@sequelize/core/decorators-legacy';
  import { Project } from './Project';
  import { User } from './User';
  
  export class Bug extends Model<InferAttributes<Bug>, InferCreationAttributes<Bug>> {
    @Attribute(DataTypes.INTEGER)
    @AutoIncrement
    @PrimaryKey
    declare id: CreationOptional<number>;
  
    @Attribute(DataTypes.STRING)
    @NotNull
    declare title: string;
  
    @Attribute(DataTypes.TEXT)
    declare description: string | null;
  
    @Attribute(DataTypes.STRING)
    declare screenshot: string | null;
  
    @Attribute(DataTypes.ENUM('feature', 'bug'))
    @NotNull
    declare type: 'feature' | 'bug';
  
    @Attribute(DataTypes.ENUM('new', 'started', 'completed', 'resolved'))
    @NotNull
    declare status: 'new' | 'started' | 'completed' | 'resolved';
  
    @BelongsTo(() => Project, 'projectId')
    declare project?: NonAttribute<Project>;
  
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare projectId: number;
  
    @BelongsTo(() => User, 'assignedTo')
    declare assignee?: NonAttribute<User>;
  
    @Attribute(DataTypes.INTEGER)
    declare assignedTo: number | null;
  
    @Attribute(DataTypes.DATE)
    declare deadline: Date | null;
  }
  export default Bug;