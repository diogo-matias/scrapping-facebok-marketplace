const sequelize = require("../config/sequelize");
const Sequelize = require("sequelize");
const Facebook = require("./facebook");

const facebook = Facebook(sequelize, Sequelize.DataTypes);

const db = {
  facebook,
  sequelize,
};

module.exports = db;
