const Sequelize = require('sequelize');
const initModels = require('./init-models');
const fs = require("fs");
const path = require("path");
const {dbConfig} = require('../src/config');
const basename = path.basename(__filename);

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host : dbConfig.HOST,
    dialect : dbConfig.dialect,
    timezone : "+09:00"
});



const db = {}




// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
//     );
//   })
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes
//     );
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.models = initModels(sequelize);

// db.sequelize.sync({
//     alter : true,
//     force : false,
// })
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

module.exports = db;
