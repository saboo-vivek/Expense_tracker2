const User = require("../models/user");
const Expense = require("../models/expenses");
const path = require("path");

const UserServices = require('../services/userservices')
const S3services = require('../services/s3services')

const { Op} = require("sequelize");

exports.getLeaderBoard = async (req, res) => {
   // console.log("---- getLeaderBoard ----")
   try {
      const expenses = await User.findAll({
         attributes: ["name", "totalexpenses"],
         order: [["totalexpenses", "DESC"]],
      });
      console.log("Expenses for get leader");
      console.log(expenses);
      res.status(200).json(expenses);
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
};

exports.getReportPage = (req, res) => {
   console.log("get report");
   try {
      res.sendFile(path.join(__dirname, "../FrontEnd/reportgeneration.html"));
   } catch (error) {
      console.log(err);
   }
   // res.sendFile(path.join(__dirname, "../FrontEnd/reportgeneration.html"));
};

exports.postData = async (req, res) => {
   try {
      const userId = req.params.id;
      let { month, year } = req.body;
      let nextmonth = parseInt(month) + 1;
      console.log(userId, month, nextmonth, year);

      const data = await Expense.findAll({
         attributes: ["amount", "description", "category"],
         where: {
            userId: userId,
            createdAt: {
               [Op.between]: [
                  `${year}-${month}-01 00:00:00`,
                  `${year}-${nextmonth}-01 00:00:00`,
               ],
            },
         },
      });
      console.log(data);
      res.status(200).json(data);
   } catch (error) {
      console.log(err);
   }
};

  
