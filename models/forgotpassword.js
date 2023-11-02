const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const forgotPassword = sequelize.define("ForgotPasswordRequests", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    uuid: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
  });


module.exports = forgotPassword;