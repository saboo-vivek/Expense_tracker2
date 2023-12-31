const expense = require("../models/expenses");
const User = require("../models/user");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../util/database");

exports.getApp = (req, res) => {
   res.sendFile(path.join(__dirname, "../Frontend/expense.html"));
};

exports.getAll = (req, res) => {
   console.log("------------------");
   console.log(req.user.dataValues);
   console.log("------------------");
   expense
      .findAll({
         where: { userId: req.user.dataValues.id },
         order: [["updatedAt", "ASC"]],
      })

      .then((data) => {
         res.status(200).send(data);
      });
};

exports.postAddExpense = async (req, res) => {
   const t = await sequelize.transaction();
   const { amount, description, category } = req.body;
   // Generate a UUID
   const uuid = uuidv4();
   const obj = {
      id: uuid,
      amount: amount,
      description: description,
      category: category,
      userId: req.user.dataValues.id,
   };
   try {
      const exp = await expense.create(obj, { transaction: t });
      const totalExpense =
         Number(req.user.dataValues.totalexpenses) + Number(amount);

      await User.update(
         { totalexpenses: totalExpense },
         { where: { id: req.user.dataValues.id }, transaction: t }
      );

      t.commit();
      console.log(exp.dataValues);
      res.status(200).send(exp.dataValues);
   } catch (error) {
      console.log(err);
      t.rollback();
      res.status(500).json({ success: false, error: err });
   }
};

exports.delExpense = async (req, res) => {
   const t = await sequelize.transaction();
   try {
      const id = req.params.id;
      const exp = await expense.findAll({ where: { id: id }, transaction: t });

      console.log(exp[0].dataValues);
      let amt = exp[0].dataValues.amount;
      const totalExpense =
         Number(req.user.dataValues.totalexpenses) - Number(amt);
      await User.update(
         { totalexpenses: totalExpense },
         { where: { id: req.user.dataValues.id }, transaction: t }
      );
      await exp[0].destroy();
      t.commit();
      res.status(200).send("Data deleted successfully");
   } catch (error) {
      await t.rollback();
      res.status(500).send(error);
      console.log(error);
   }
   
};

const S3services=require('../services/s3services')
exports.getDownload = async (req, res, next) => {
   try {
      console.log('get Download')
      console.log(req.user)
      const userid = req.user.dataValues.id;
      const expenses = await req.user.getExpenses(req);
      const stringifiedExpenses = JSON.stringify(expenses);
      const filename = `Expenses${userid}/${new Date()}.txt`;
      const fileUrl = await S3services.uploadtoS3(
         stringifiedExpenses,
         filename
      );
      res.status(200).json({ fileUrl, success: true });
   } catch (err) {
      console.log(err);
      res.status(500).json({ fileUrl: "", success: false, err: err });
   }
};