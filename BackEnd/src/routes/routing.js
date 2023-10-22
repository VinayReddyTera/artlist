const express = require("express");
const router = express.Router();
const userservice = require("../service/users");
const jwt = require('jsonwebtoken');
const verifyToken = require("../utilities/verifyToken");
const validate = require("../utilities/validateData");
let skillList = [
  "Director",
  "Producer",
  "Screenwriter",
  "Cinematographer/Director of Photography (DP)",
  "Actor/Actress",
  "Editor",
  "Costume Designer",
  "Makeup and Hair Stylists",
  "Production Designer/Art Director",
  "Location Manager",
  "Sound Engineer",
  "Composer",
  "Music Director",
  "Choreographer",
  "Dancer",
  "Stunt Coordinator",
  "Special Effects Supervisor",
  "Visual Effects (VFX) Artists",
  "Dialect Coach",
  "Production Manager",
  "Casting Director",
  "Script Supervisor",
  "Gaffer",
  "Key Grip",
  "Assistant Director (1st AD, 2nd AD)",
  "Production Assistant (PA)",
  "Set Decorator",
  "Wardrobe Supervisor",
  "Animal Wrangler",
  "DIT (Digital Imaging Technician)",
  "Colorist",
  "Grip",
  "Best Boy",
  "Boom Operator",
  "Caterer/Craft Service",
  "Legal and Clearance Team",
  "Publicist",
  "Singer",
  "Musician",
  "Sound Recordist",
  "Sound designer",
  "Lighting Designer",
  "Prop Master",
  "Storyboard Artist",
  "Location Scout",
  "Dance Instructor",
  "Fight Choreographer",
  "SFX Makeup Artist",
  "Foley Artist",
  "ADR Supervisor",
  "Post-Production Supervisor",
  "Public Relations Manager",
  "Film Editor",
  "Line producer",
  "Marketing Director",
  "Set Builder",
  "Cinematographer's Assistant",
  "Background performers",
];
let states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry"
];

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
        let obj;
        if(req.body.role == 'artist'){
          obj = {
            status : data.status,
            data : data.data,
            token : token,
            add : data.add
          }
        }
        else{
          obj = {
            status : data.status,
            data : data.data,
            token : token
          }
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
  else if(req.body.role == 'artist'){
    if(!req.body.address 
      || !req.body.mandal 
      || !req.body.district
      || !req.body.state
      || !req.body.pincode){
      let response = {
        status : 204,
        data : 'Required fields missing'
      }
      return res.json(response)
    }
    else if(!states.includes(req.body.state)){
      let response = {
        status : 204,
        data : 'Invalid State Name'
      }
      return res.json(response)
    }
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

//router to verify email
router.get('/verifyEmail/:token',(req,res,next)=>{
  if(req.params.token){
    jwt.verify(req.params.token,process.env.JWT_Secret,(err,user)=>{
      if(err){
          let userdata = jwt.decode(req.params.token)
          let url = `${process.env.redirect_Url}/${userdata.data.role}-profile?status=204&data=Email verification link expired`
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

//  auth apis done

//router to add new skill
router.post('/addSkill',verifyToken,(req,res,next)=>{
  if(req.body.genre.length){
    for(let i of req.body.genre){
      if(
        !i.experience 
    || !(i.portfolio.length > 0)
    || !i.status
    || !i.name
      ){
        let response = {
          status : 204,
          data : 'Required fields missing'
        }
        return res.json(response)
      }
      else if((i.status != 'active') || (i.validated != false) || (req.body.experience<0) ||  (req.body.experience>150)){
        let response = {
          status : 204,
          data : 'Incorrect Data'
        }
        return res.json(response)
      }
      else if(
        !validate.validateXss(req.body.name)
     || !validate.validateXss(req.body.experience)
     || !validate.validateXss(req.body.status)
       ){
       let response = {
         status : 204,
         data : 'Invalid data format'
       }
       return res.json(response)
     }
    }
  }
  if(!req.body.experience 
    || !(req.body.portfolio.length > 0) 
    || !req.body.status
    || !req.body.name
    || !req.body.pricing.hourly
    || !req.body.pricing.event
    || !req.body.pricing.fullDay){
    let response = {
      status : 204,
      data : 'Required fields missing'
    }
    return res.json(response)
  }
  else if((req.body.status != 'active') || (req.body.validated != false) || (req.body.experience<0) ||  (req.body.experience>150) || (req.body.pricing.event <=0)  || (req.body.pricing.hourly <=0) || (req.body.pricing.fullDay <=0)){
    let response = {
      status : 204,
      data : 'Incorrect Data'
    }
    return res.json(response)
  }
  else if(
     !validate.validateXss(req.body.name)
  || !validate.validateXss(req.body.experience)
  || !validate.validateXss(req.body.status)
  || !validate.validateXss(req.body.pricing.hourly)
  || !validate.validateXss(req.body.pricing.event)
  || !validate.validateXss(req.body.pricing.fullDay)
    ){
    let response = {
      status : 204,
      data : 'Invalid data format'
    }
    return res.json(response)
  }
  else if(!skillList.includes(req.body.name)){
    let response = {
      status : 204,
      data : 'Invalid data format'
    }
    return res.json(response)
  }
  else{
    let id = jwt.decode(req.headers.authorization).data.data._id;
    userservice.addSkill(req.body,id).then((data)=>{
      return res.json(data)
    }).catch((err)=>{
      next(err)
    })
  }
})

//router to get artist skill
router.get('/getArtistSkill',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data.data._id;
  userservice.getArtistSkill(id).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to update artist skill
router.post('/updateArtistSkill',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data.data._id;
  userservice.updateArtistSkill(req.body,id).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to fetch artist skill
router.get('/getArtistSkill',verifyToken,(req,res,next)=>{
  userservice.getArtistSkill().then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

module.exports = router