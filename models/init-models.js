var DataTypes = require("sequelize").DataTypes;
var _career = require("./career");
var _companies = require("./companies");
var _event_posts = require("./event_posts");
var _job_posts = require("./job_posts");
var _license = require("./license");
var _resume = require("./resume");
var _users = require("./users");
var _user_role = require("./user_role");

function initModels(sequelize) {
  var career = _career(sequelize, DataTypes);
  var companies = _companies(sequelize, DataTypes);
  var event_posts = _event_posts(sequelize, DataTypes);
  var job_posts = _job_posts(sequelize, DataTypes);
  var license = _license(sequelize, DataTypes);
  var resume = _resume(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var user_role = _user_role(sequelize, DataTypes);

  users.belongsTo(companies, { as: "company", foreignKey: "company_id", onDelete: "cascade", onUpdate: "cascade"});
  companies.hasMany(users, { as: "users", foreignKey: "company_id", onDelete: "cascade", onUpdate: "cascade"});
  resume.belongsTo(job_posts, { as: "job_title", foreignKey: "job_title_id", onDelete: "cascade", onUpdate: "cascade"});
  job_posts.hasMany(resume, { as: "resumes", foreignKey: "job_title_id", onDelete: "cascade", onUpdate: "cascade"});
  career.belongsTo(resume, { as: "resume", foreignKey: "resume_id", onDelete: "cascade", onUpdate: "cascade"});
  resume.hasMany(career, { as: "careers", foreignKey: "resume_id", onDelete: "cascade", onUpdate: "cascade"});
  license.belongsTo(resume, { as: "resume", foreignKey: "resume_id", onDelete: "cascade", onUpdate: "cascade"});
  resume.hasMany(license, { as: "licenses", foreignKey: "resume_id", onDelete: "cascade", onUpdate: "cascade"});
  event_posts.belongsTo(users, { as: "writer_user", foreignKey: "writer", onDelete: "cascade", onUpdate: "cascade"});
  users.hasMany(event_posts, { as: "event_posts", foreignKey: "writer", onDelete: "cascade", onUpdate: "cascade"});
  job_posts.belongsTo(users, { as: "writer_user", foreignKey: "writer", onDelete: "cascade", onUpdate: "cascade"});
  users.hasMany(job_posts, { as: "job_posts", foreignKey: "writer", onDelete: "cascade", onUpdate: "cascade"});
  resume.belongsTo(users, { as: "user", foreignKey: "user_id", onDelete: "cascade", onUpdate: "cascade"});
  users.hasMany(resume, { as: "resumes", foreignKey: "user_id", onDelete: "cascade", onUpdate: "cascade"});
  users.belongsTo(user_role, { as: "user_role_user_role", foreignKey: "user_role", onDelete: "cascade", onUpdate: "cascade"});
  user_role.hasMany(users, { as: "users", foreignKey: "user_role", onDelete: "cascade", onUpdate: "cascade"});

  return {
    career,
    companies,
    event_posts,
    job_posts,
    license,
    resume,
    users,
    user_role,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
