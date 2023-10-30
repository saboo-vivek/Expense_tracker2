const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Expense = sequelize.define("expense", {
   id: {
      type: Sequelize.STRING,
      primaryKey:true,
      allowNull: false,
   },
   amount: { type: Sequelize.DOUBLE, allownull: false },
   description: { type: Sequelize.STRING, allownull: false },
   category: { type: Sequelize.STRING, allownull: false },
});

module.exports = Expense;
