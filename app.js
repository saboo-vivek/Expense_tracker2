require('dotenv').config();
const express = require("express");
const sequelize = require("./util/database");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authroutes");
app.use(authRoutes);

const expenseRoutes = require("./routes/expenseroutes");
app.use(expenseRoutes);

const purchaseroutes = require('./routes/purchase');
app.use(purchaseroutes);

// const premiumroutes = require('./routes/premium');
// app.use(premiumroutes);

// const forgotpasswordroutes = require('./routes/forgotpassword');
// app.use(forgotpasswordroutes);

const User = require("./models/user");
const Expense = require("./models/expenses");
const Order = require('./models/orders');

User.hasMany(Expense);
Expense.belongsTo(User)

User.hasMany(Order);
Order.belongsTo(User);

// User.hasMany(forGotPassword);
// forGotPassword.belongsTo(User);

async function initiate() {
   try {
      // await sequelize.sync({force:true});
      await sequelize.sync();
      app.listen(3000, () => {
         console.log("Server started on port 3000");
      });
   } catch (err) {
      console.log("error", err);
   }
}
initiate();
