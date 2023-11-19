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
let languages = [
  "Hindi",
  "Bengali",
  "English",
  "Telugu",
  "Marathi",
  "Tamil",
  "Urdu",
  "Gujarati",
  "Kannada",
  "Odia",
  "Punjabi",
  "Malayalam",
  "Assamese",
  "Sanskrit",
  "Konkani",
  "Nepali",
  "Manipuri",
  "Sindhi",
  "Maithili",
  "Dogri",
  "Bodo",
  "Kashmiri",
  "Santhali"
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
        const token = jwt.sign({data:data.data,exp : expirationTime},process.env.JWT_Secret);
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
  if(req.body.role == 'artist'){
    if(!req.body.address 
      || !req.body.mandal 
      || !req.body.district
      || !req.body.language
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
    for(let i of req.body.language){
      if(!languages.includes(i)){
        let response = {
          status : 204,
          data : 'Invalid Language Name'
        }
        return res.json(response)
      }
    }
  }
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
router.get('/sendVerifyEmail', verifyToken, (req, res, next)=>{
  let userdata = jwt.decode(req.headers.authorization)
  let payload = {
    email : userdata.data.email,
    role : userdata.data.role
  }
  if(payload.role != 'artist' && payload.role != 'user'){
    let response = {
      status : 204,
      data : 'Invalid role'
    }
    return res.json(response)
  }
  else{
    let protocol = req.headers.origin.split(':')[0]
    userservice.sendVerifyEmail(payload,req.headers.host,protocol).then((data)=>{
      return res.json(data)
    }).catch((err)=>{
      next(err)
    })
  }
})

//router to verify email
router.get('/verifyEmail/:token',(req,res,next)=>{
  if(req.params.token){
    jwt.verify(req.params.token,process.env.JWT_Secret,(err,user)=>{
      if(err){
          let userdata = jwt.decode(req.params.token)
          let url = `${process.env.redirect_Url}/${userdata.role}-profile?status=204&data=Email verification link expired`
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
  else if((req.body.status != 'active') || (req.body.validated != 'nv') || (req.body.experience<0) ||  (req.body.experience>150) || (req.body.pricing.event <=0)  || (req.body.pricing.hourly <=0) || (req.body.pricing.fullDay <=0)){
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
    let id = jwt.decode(req.headers.authorization).data._id;
    userservice.addSkill(req.body,id).then((data)=>{
      return res.json(data)
    }).catch((err)=>{
      next(err)
    })
  }
})

//router to get artist skill
router.get('/getArtistSkill',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data._id;
  userservice.getArtistSkill(id).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to update artist skill
router.post('/updateArtistSkill',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data._id;
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

//router to add approver
router.post('/addApprover',verifyToken,(req,res,next)=>{
  for(let i of req.body?.skillName){
    if(!skillList.includes(i)){
      let response = {
        status : 204,
        data : 'Invalid data format'
      }
      return res.json(response)
    }
  }
  for(let i of req.body?.language){
    if(!languages.includes(i)){
      let response = {
        status : 204,
        data : 'Invalid data format'
      }
      return res.json(response)
    }
  }
  if(!req.body.email
    || !req.body.role
    || !req.body.name
    || !req.body.phoneNo
    || !req.body.skillName?.length
    || !req.body.language?.length
    ){
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
    userservice.addApprover(req.body).then((data)=>{
      return res.json(data)
    }).catch((err)=>{
      next(err)
    })
  }
})

//router to fetch all approvers
router.get('/allApprovers',verifyToken,(req,res,next)=>{
  let role = jwt.decode(req.headers.authorization).data?.role;
  if(role == 'admin'){
    userservice.allApprovers().then((data)=>{
      return res.json(data)
    }).catch((err)=>{
      next(err)
    })
  }
  else{
    let response = {
      status : 204,
      data : 'Unauthorized request'
    }
    return res.json(response)
  }
})

//router to edit approver
router.post('/editApprover',verifyToken,(req,res,next)=>{
  for(let i of req.body.skillName){
    if(!skillList.includes(i)){
      let response = {
        status : 204,
        data : 'Invalid data format'
      }
      return res.json(response)
    }
  }
  for(let i of req.body?.language){
    if(!languages.includes(i)){
      let response = {
        status : 204,
        data : 'Invalid data format'
      }
      return res.json(response)
    }
  }
  if(!req.body.email
    || !req.body.role
    || !req.body.name
    || !req.body.phoneNo
    || !req.body.id
    || !req.body.skillName?.length
    || !req.body.language?.length
    ){
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
    userservice.editApprover(req.body).then((data)=>{
      return res.json(data)
    }).catch((err)=>{
      next(err)
    })
  }
})

//router to fetch unapproved artists
router.get('/pendingArtists',verifyToken,(req,res,next)=>{
  let userData = jwt.decode(req.headers.authorization).data;
  if(userData.role == 'tag'){
    userservice.pendingArtists(userData._id).then((data)=>{
      return res.json(data)
    }).catch((err)=>{
      next(err)
    })
  }
  else{
    let response = {
      status : 204,
      data : 'Unauthorized request'
    }
    return res.json(response)
  }
})

//router to edit approver
router.post('/approveSkill',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data._id;
  if(req.body.genre.length > 0){
    for(let i of req.body.genre){
      if(i.status != 'a' && i.status != 'r'){
        let response = {
          status : 204,
          data : 'Invalid data format'
        }
        return res.json(response)
      }
      else if(!i.id){
        let response = {
          status : 204,
          data : 'Required fields missing'
        }
        return res.json(response)
      }
    }
  }
  if(req.body.status){
    if(!req.body.id){
      let response = {
        status : 204,
        data : 'Required fields missing'
      }
      return res.json(response)
    }
    else if(req.body.status != 'a' && req.body.status != 'r'){
      let response = {
        status : 204,
        data : 'Invalid data format'
      }
      return res.json(response)
    }
  }
  userservice.approveSkill(req.body,id).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to get past approves
router.get('/getArtistHistory',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data._id;
  userservice.getArtistHistory(id).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to fetch available days
router.get('/getAvailable',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data._id;
  userservice.getAvailable(id).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to update Available days
router.post('/updateAvailable',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data._id;
  userservice.updateAvailable(req.body,id).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to update Available days
router.post('/updateAvailable',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data._id;
  userservice.updateAvailable(req.body,id).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to update Inauguration data
router.post('/updateinaug',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data._id;
  userservice.updateinaug(req.body,id).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to update wishes data
router.post('/updatewishes',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data._id;
  userservice.updatewishes(req.body,id).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to get artists data
router.get('/getArtists',verifyToken,(req,res,next)=>{
  // let role = jwt.decode(req.headers.authorization).data.role;
  userservice.getArtists().then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to fetch avilable
router.post('/fetchAvailable',verifyToken,(req,res,next)=>{
  // let role = jwt.decode(req.headers.authorization).data.role;
  userservice.fetchAvailable(req.body.id).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to book artist
router.post('/bookArtist',verifyToken,(req,res,next)=>{
  let userId = jwt.decode(req.headers.authorization).data._id;
  let payload = req.body;
  payload.userId = userId;
  userservice.bookArtist(payload).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to fetch history
router.get('/fetchHistory',verifyToken,(req,res,next)=>{
  let data = jwt.decode(req.headers.authorization).data;
  let payload = {
    id : data._id,
    role : data.role
  }
  userservice.fetchHistory(payload).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to give artist feedback
router.get('/giveArtistFeedback',verifyToken,(req,res,next)=>{
  userservice.giveArtistFeedback(req.body).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to fetch upcoming requests
router.get('/fetchNewRequests',verifyToken,(req,res,next)=>{
  let id = jwt.decode(req.headers.authorization).data._id;
  let payload = {
    role : 'artist',
    id : id
  }
  userservice.fetchNewRequests(payload).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to update event status
router.post('/updateEvent',verifyToken,(req,res,next)=>{
  userservice.updateEvent(req.body).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

//router to Reschedule Event
router.post('/updateBooking',verifyToken,(req,res,next)=>{
  let role = jwt.decode(req.headers.authorization).data.role;
  let payload = req.body;
  payload.role = role;
  userservice.updateBooking(req.body).then((data)=>{
    return res.json(data)
  }).catch((err)=>{
    next(err)
  })
})

module.exports = router