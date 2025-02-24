const { DataTypes, Model } = require("sequelize");

class User extends Model {}

module.exports = (sequelize) => {
  User.init(
    {
      username: {
        type: DataTypes.STRING,
      },
      email: {
        unique: true,
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      access_token: {
        type: DataTypes.STRING,
      },
      refresh_token: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      sequelize,
      tableName: "users",
    }
  );

  return User;
};
