const { v4: uuidv4 } = require("uuid");
const ForgotPassword = require("../models/forgotpassword");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const path = require("path");

const Sib = require("sib-api-v3-sdk");
// require("dotenv").config();
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
   email: "vivek2sahu@gmail.com",
};

exports.getForm = (req, res) => {
   res.sendFile(path.join(__dirname, "../Frontend/forgotpassword.html"));
};

exports.postForgotpass = async (req, res) => {
   try {
      const email = req.body.email;
      const users = await User.findAll({ where: { email: email } });
      if (users[0]) {
         console.log(users[0].dataValues);
         const uuid = uuidv4();
         await ForgotPassword.create({
            uuid: uuid,
            userId: users[0].dataValues.id,
         });

         const recievers = [{ email: email }];

         await tranEmailApi.sendTransacEmail({
            sender,
            to: recievers,
            subject: "link to reset password",
            textContent: `http://localhost:3000/password/resetpasswordform/{{params.uuid}}`,
            params: { uuid: uuid },
         });
         const link = `http://localhost:3000/password/resetpasswordform/${uuid}`;
         res.status(200).json({
            success: true,
            message: "email sent to reset password",
            link: link,
         });
      } else {
         res.status(400).json({
            message: "User Email Doesn't Exist In DataBase",
         });
      }
   } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
   }
};

exports.getResetpassForm= async (req, res) => {
   try {
      const uuid = req.params.uuid;
      const forgotpasswords = await ForgotPassword.findAll({
         where: { uuid: uuid, isActive: true },
      });
      if (forgotpasswords[0]) {
         console.log("getResetpass")
         console.log(forgotpasswords[0].dataValues)
         forgotpasswords[0].update({ isActive: false });
         res.sendFile(path.join(__dirname, "../FrontEnd/resetpassword.html"));
      } else {
         res.status(400).json({ message: "invalid request" });
      }
   } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
   }
};

exports.postUpdate = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      const users = await User.findAll({ where: { email: email } });
      if (users[0]) {
         bcrypt.hash(password, 10, async (err, hash) => {
            await users[0].update({ password: hash });
            console.log("password Updated");
            res.status(201).json({ message: "password changed  successfully" });
         });
      } else {
         res.status(400).json({ message: "No such user Found" });
      }
   } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
   }
};

// exports.loginpage = (req, res) => {
//    res.sendFile(path.join(__dirname, "../FrontEnd/resetpassword.html"));
// };
