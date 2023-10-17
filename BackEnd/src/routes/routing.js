const express = require("express");
const router = express.Router();
const userservice = require("../service/users");
const jwt = require('jsonwebtoken');
const verifyToken = require("../utilities/verifyToken");
const validate = require("../utilities/validateData");

// api to login users
router.post('/login',(req,res,next)=>{
  if(!req.body.email || !req.body.password || !req.body.role){
    let response = {
      status : 204,
      data : 'Required fields missing'
    }
    return res.json(response)
  }
  else if(!validate.validateEmail(req.body.email)){
    let response = {
      status : 204,
      data : 'Invalid email format'
    }
    return res.json(response)
  }
  else{
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
        return res.json(obj)
      }
      }).catch((err)=>{
        next(err)
      })
  }
})

// api to register users
router.post('/register',(req,res,next)=>{
  if(!req.body.email 
    || !req.body.password 
    || !req.body.role
    || !req.body.name
    || !req.body.phoneNo){
    let response = {
      status : 204,
      data : 'Required fields missing'
    }
    return res.json(response)
  }
  else if(!validate.validateEmail(req.body.email)){
    let response = {
      status : 204,
      data : 'Invalid email format'
    }
    return res.json(response)
  }
  else if(!validate.validatePhone(req.body.phoneNo)){
    let response = {
      status : 204,
      data : 'Invalid Phone Number format'
    }
    return res.json(response)
  }
  else if(!validate.validateName(req.body.name)){
    let response = {
      status : 204,
      data : 'Invalid Name format'
    }
    return res.json(response)
  }
  else if(!validate.validateXss(req.body.name)){
    let response = {
      status : 204,
      data : 'Invalid data format'
    }
    return res.json(response)
  }
  else{
    userservice.register(req.body).then((data)=>{
      return res.json(data)
    }).catch((err)=>{
      next(err)
    })
  }
})

//router to fetch forgotten password of user
router.post('/forgotPassword', (req, res, next)=>{
  let userData = req.body
  if(!userData.email || !userData.role){
    let response = {
      status : 204,
      data : 'Required fields missing'
    }
    return res.json(response)
  }
  else if(!validate.validateEmail(userData.email)){
    let response = {
      status : 204,
      data : 'Invalid email format'
    }
    return res.json(response)
  }
  else{
    userservice.forgotPassword(userData,req.headers.origin).then((data)=>{
      return res.json(data);
  }).catch(err => next(err));
  }
})

//router to reset password
router.post('/resetPassword', (req, res, next)=>{
  if(req.body.token && req.body.password){
    jwt.verify(req.body.token,process.env.JWT_Secret,(err,user)=>{
      if(err){
          let response = {
              status : 204,
              data : 'reset password link expired'
          }
          return res.json(response)
      }
      else{
          let payload = {
              email : user.data.email,
              role : user.data.role,
              otp:user.data.otp,
              password : req.body.password
          }
          userservice.resetPassword(payload).then((data)=>{
              return res.json(data);
          }).catch(err => next(err));
      }
    });
  }
  else{
    let response = {
      status : 204,
      data : 'Required fields missing'
    }
    return res.json(response)
  }
})

//router to change password
router.post('/changePassword', verifyToken, (req, res, next)=>{
  if(req.body.password && req.body.newPassword && req.body.role && req.body.email){
    userservice.changePassword(req.body).then((data)=>{
      return res.json(data)
    }).catch((err)=>{
      next(err)
    })
  }
  else{
    let response = {
      status : 204,
      data : 'Required fields missing'
    }
    return res.json(response)
  }
})

//router to update profile
router.post('/updateProfile', verifyToken, (req, res, next)=>{
  if(req.body.name && req.body.email && req.body.phoneNo && req.body.id && req.body.profileStatus && req.body.role){
    if(
         !validate.validateXss(req.body.name)
      || !validate.validateXss(req.body.profileStatus)
      || !validate.validateName(req.body.name) 
      || !validate.validateEmail(req.body.email)
      || !validate.validatePhone(req.body.phoneNo)
      ){
      let response = {
        status : 204,
        data : 'Incorrect data format'
      }
      return res.json(response)
    }
    else{
      userservice.updateProfile(req.body).then((data)=>{
        if(data.status == 200){
          const expirationTime = Math.floor(Date.now() / 1000) + 21600;
          const token = jwt.sign({data:data.userData,exp : expirationTime},process.env.JWT_Secret);
          let response = {
            status : 200,
            data : data.data,
            token : token
          }
          return res.json(response)
        }
        else{
          return res.json(data)
        }
      }).catch((err)=>{
        next(err)
      })
    }
  }
  else{
    let response = {
      status : 204,
      data : 'Required fields missing'
    }
    return res.json(response)
  }
})

//router to sendVerifyEmail
router.post('/sendVerifyEmail', verifyToken, (req, res, next)=>{
  if(req.body.email && req.body.role){
    if(
         !validate.validateEmail(req.body.email)
      ){
      let response = {
        status : 204,
        data : 'Invalid email address'
      }
      return res.json(response)
    }
    else if(req.body.role != 'artist' && req.body.role != 'user'){
      let response = {
        status : 204,
        data : 'Invalid role'
      }
      return res.json(response)
    }
    else{
      userservice.sendVerifyEmail(req.body,req.headers.host).then((data)=>{
        return res.json(data)
      }).catch((err)=>{
        next(err)
      })
    }
  }
  else{
    let response = {
      status : 204,
      data : 'Required fields missing'
    }
    return res.json(response)
  }
})

router.get('/verifyEmail/:token',(req,res,next)=>{
  if(req.params.token){
    jwt.verify(req.params.token,process.env.JWT_Secret,(err,user)=>{
      if(err){
          let url = `${process.env.redirect_Url}/${user.data.role}-profile?status=204&data=Email verification link expired`
          return res.redirect(url)
      }
      else{
          let payload = {
              email : user.data.email,
              role : user.data.role
          }
          userservice.verifyEmail(payload).then((data)=>{
            let url = `${process.env.redirect_Url}/${user.data.role}-profile?status=${data.status}&data=${data.data}`;
            return res.redirect(url)
          }).catch(err => next(err));
      }
    });
  }
  else{
    let url = `${process.env.redirect_Url}/${user.data.role}-profile?status=204&data=Invalid Link`;
    return res.redirect(url)
  }
})

module.exports = router