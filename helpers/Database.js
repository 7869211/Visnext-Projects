const fs = require("fs");
const path = require("path");
const config = require("config");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    sync: { force: true },
    host: config.database.host,
    dialect: config.database.client,
    ssl: true,
    pool: config.database.pool,
    logging: true
  }
)

fs.readdirSync('./models')
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join('../models', file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;