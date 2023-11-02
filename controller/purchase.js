const razorpay = require("razorpay");
const Order = require("../models/orders");
const jwt = require("jsonwebtoken");

exports.purchasepremium = async (req, res, next) => {
// const   RAZORPAY_KEY_ID="rzp_test_nOf1NUd5JxVDyX"
// const RAZORPAY_KEY_SECRET="VAvEA5Rai0GZMuyaORzkn6JL"
   try {
      var rzp = new razorpay({
         // key_id: "rzp_test_CGxQODGmMZPUcr",
         // key_secret: "Z1JASaBnY9OAS9DoNs12P6L5",

         key_id: process.env.RAZORPAY_KEY_ID,
         key_secret: process.env.RAZORPAY_KEY_SECRET,

         // key_id: RAZORPAY_KEY_ID,
         // key_secret: RAZORPAY_KEY_SECRET,
         
      });
      const amount = 1000;

      console.log("key id :", process.env.RAZORPAY_KEY_ID);
      console.log("key secret:", process.env.RAZORPAY_KEY_SECRET);

      rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
         if (err) {
            console.log("order ERROR : ");
            console.log(err)
            console.log('-------------')
            throw new Error(JSON.stringify(err));
         }
         console.log(order);
         // console.log("----------------------");
         req.user
            .createOrder({ orderid: order.id, status: "PENDING" })
            .then(() => {
               return res.status(201).json({ order, key_id: rzp.key_id });
            })
            .catch((err) => {
               throw new Error(err);
            });
      });
   } catch (err) {
      console.log(err);
      res.status(403).json({ message: " something went wrong ", error: err });
   }
};

exports.updateTransaction = async (req, res, next) => {
   try {
      const { payment_id, order_id } = req.body;
      const id = req.user.id;
      const order = await Order.findOne({ where: { orderid: order_id } });
      const promise1 = order.update({
         paymentid: payment_id,
         status: "SUCCESSFUL",
      });
      const promise2 = req.user.update({ ispremiumuser: true });

      const token = await jwt.sign(
         { id: id, ispremiumuser: true },
         process.env.TOKEN_KEY
      );
      
      Promise.all([promise1, promise2])
         .then(() => {
            return res.status(202).json({
               success: true,
               message: "Transaction Successful",
               token: token,
            });
         })
         .catch((err) => {
            throw new Error(err);
         });
   } catch (err) {
      console.log(err);
      res.status(403).json({
         message: " updating transaction something went wrong ",
         error: err,
      });
   }
};

exports.updateTransactionFail = async (req, res, next) => {
   try {
      const { order_id } = req.body;
      const order = await Order.findOne({ where: { orderid: order_id } });
      await order.update({ status: "FAILED" });
      return res
         .status(400)
         .json({ success: false, message: "Transaction Failed" });
   } catch (err) {
      console.log(err);
      res.status(403).json({
         message: " updating transaction something went wrong ",
         error: err,
      });
   }
};
