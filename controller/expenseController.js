const expense = require("../models/expenses");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Generate a UUID

exports.getApp = (req, res) => {
   res.sendFile(path.join(__dirname, "../Frontend/expense.html"));
};

exports.getAll = (req, res) => {
   console.log("------------------")
   console.log(req.user.dataValues)
   console.log("------------------")
        expense.findAll({ where: { userId: req.user.dataValues.id } }).then((data) => {
           res.status(200).send(data);
        });
     };

exports.postAddExpense = (req, res) => {
   const { amount, description, category } = req.body;
   const uuid = uuidv4();
   const obj = {
      id: uuid,
      amount: amount,
      description: description,
      category: category,
      userId:req.user.dataValues.id
   };
   expense
      .create(obj)
      .then((data) => {
         console.log(data.dataValues);
         res.status(200).send(data.dataValues);
      })
      .catch((err) => res.status(500).send(err));
};
exports.delExpense = (req, res) => {
   expense
      .destroy({ where: { id: req.params.id } })
      .then(() => {
         res.status(200).send("Data deleted successfully");
      })
      .catch((error) => {
         res.status(500).send(error);
      });
};
