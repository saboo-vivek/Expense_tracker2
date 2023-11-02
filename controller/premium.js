const User = require("../models/user");
const Expense = require("../models/expenses");
const path = require("path");


exports.getLeaderBoard = async (req, res) => {
        // console.log("---- getLeaderBoard ----")
        try {
           const expenses = await User.findAll({
              attributes: ["name", "totalexpenses"],
              order: [["totalexpenses", "DESC"]],
           });
           console.log('Expenses for get leader')
           console.log(expenses)
           res.status(200).json(expenses);
        } catch (err) {
           console.log(err);
           res.status(500).json(err);
        }
     };

     exports.getReport = (req, res) => {
      res.sendFile(path.join(__dirname, "../Frontend/reportgeneration.html"));
   };


   //   exports.download = async (req, res, next) => {
   //    try {
   //       const userid = req.user.id;
   //       const expenses = await UserServices.getExpenses(req);
   //       const stringifiedExpenses = JSON.stringify(expenses);
   //       const filename = `Expenses${userid}/${new Date()}.txt`;
   //       const fileUrl = await S3services.uploadtoS3(
   //          stringifiedExpenses,
   //          filename
   //       );
   //       res.status(200).json({ fileUrl, success: true });
   //    } catch (err) {
   //       console.log(err);
   //       res.status(500).json({ fileUrl: "", success: false, err: err });
   //    }
   // };