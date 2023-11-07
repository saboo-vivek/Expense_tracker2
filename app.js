require('dotenv').config();
const path=require('path');
const fs=require('fs')
const express = require("express");
const sequelize = require("./util/database");
const cors = require("cors");
const helmet=require("helmet");
const morgan=require("morgan");

const app = express();




const authRoutes = require("./routes/authroutes");
const expenseRoutes = require("./routes/expenseroutes");
const purchaseroutes = require('./routes/purchase');
const premiumroutes = require('./routes/premium');
const forgotroute = require('./routes/forgotpassword');


const accesslogstream=fs.createWriteStream(path.join(__dirname,'access.log'),{flag:'a'})

app.use(cors());
// app.use(helmet());
app.use( helmet({ contentSecurityPolicy: false }) );
app.use(morgan('combined',{stream:accesslogstream}));
app.use(express.json());


app.use(authRoutes);
app.use(expenseRoutes);
app.use(purchaseroutes);
app.use(premiumroutes);
app.use(forgotroute);


const User = require("./models/user");
const Expense = require("./models/expenses");
const Order = require('./models/orders');
const ForGotPassword=require('./models/forgotpassword')

User.hasMany(Expense);
Expense.belongsTo(User)

User.hasMany(Order);
Order.belongsTo(User);


User.hasMany(ForGotPassword);
ForGotPassword.belongsTo(User);

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
