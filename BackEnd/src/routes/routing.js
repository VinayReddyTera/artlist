const express = require("express");
const router = express.Router();
const userservice = require("../service/users");
const jwt = require('jsonwebtoken');
const verifyToken = require("../utilities/verifyToken");

// api to login users
router.post('/login',(req,res,next)=>{
  userservice.login(req.body).then((data)=>{
    if(data.status == 200){
      const expirationTime = Math.floor(Date.now() / 1000) + 21600;
      const token = jwt.sign({data:data,exp : expirationTime},process.env.JWT_Secret);
      let obj = {
        status : data.status,
        data : data.data,
        token : token
      }
      res.status(200).json(obj)
    }
    else{
      let obj = {
        status : data.status,
        data : data.data,
        token : ''
      }
      res.json(obj)
    }
    }).catch((err)=>{
      next(err)
    })
})

// api to register users
router.post('/register',(req,res,next)=>{
  userservice.register(req.body).then((data)=>{
      res.json(data)
    }).catch((err)=>{
      next(err)
    })
})

//router to fetch forgotten password of user
router.post('/forgotPassword', (req, res, next)=>{
  let userData = req.body
  userservice.forgotPassword(userData).then((data)=>{
      res.json(data);
  }).catch(err => next(err));
})

//router to reset password
router.post('/resetPassword', (req, res, next)=>{
  let userData = req.body
  userservice.resetPassword(userData).then((data)=>{
      res.json(data);
  }).catch(err => next(err));
})

module.exports = router