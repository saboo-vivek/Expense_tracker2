const user = require("../models/user");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getLoginpage = (req, res) => {
   res.sendFile(path.join(__dirname, "../Frontend/login.html"));
};

exports.getHome = (req, res) => {
   res.sendFile(path.join(__dirname, "../Frontend/signup.html"));
};

exports.postSignup = async (req, res) => {
   console.log(req.body);
   try {
      const { name, email, password } = req.body;
      if (
         name.length === 0 ||
         name == null ||
         password == null ||
         email == null ||
         email.length === 0 ||
         password.length === 0
      ) {
         res.status(400).json({ err: "bad  parameters" });
      }
      const users = await user.findAll({ where: { email: email } });
      if (users[0]) {
         res.status(403).json({ failed: "user exists", error: "user exists" });
      } else {
         console.log(">> in else");
         bcrypt.hash(password, 10, async (err, hash) => {
            await user.create({ name: name, email: email, password: hash });
            res.status(201).json({ message: "signed up successfully" });
         });
      }
   } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
   }
};

exports.postLogin = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      if (
         password == null ||
         email == null ||
         email.length === 0 ||
         password.length === 0
      ) {
         res.status(400).json({ err: "bad  parameters" });
      }
      const users = await user.findAll({ where: { email: email } });

      if (users[0]) {
         const user0 = users[0];
         console.log(user0.dataValues);
         bcrypt.compare(
            password,
            user0.dataValues.password,
            async (err, response) => {
               if (response == true) {

                  const token =  await jwt.sign({ id: user0.dataValues.id , ispremiumuser : user0.dataValues.ispremiumuser }, process.env.TOKEN_KEY);

                  res.status(200).json({
                     message: "Login successful",
                     token: token,
                  });

               } else {
                  res.status(401).json({ message: "bad credentials" });
               }
            }
         );
      } else {
         res.status(404).json({ message: "user not found" });
      }
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
};
