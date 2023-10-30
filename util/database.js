const Sequelize = require('sequelize')
const sequelize = new Sequelize('expense_tracker_2', 'root', 'Vivek@123',{
    dialect:'mysql',
    host:'localhost'
})

module.exports = sequelize