const jwt = require('jsonwebtoken');
const User = require('../models/user');
//const { NUMBER } = require('sequelize');

exports.authenticate = (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        // console.log('tokenrcvd' , token);
        const user = jwt.verify(token ,process.env.TOKEN_KEY );
        const userid = user.id;
        console.log('user id : ', userid);
        User.findByPk(userid).then(
            user=>{

                // console.log('user verified' , JSON.stringify(user));
                req.user=user;
                next();
            }
        ).catch(err=> { throw new Error(err)})
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
    }
}

// exports.checkpremium =( req,res,next)=>{
//     const ispremiumuser = req.user.ispremiumuser ;
//     if(!ispremiumuser){
//         return res.status(400).json({message : 'Buy Premium'});
//     }else{
//         next();
//     }

// }