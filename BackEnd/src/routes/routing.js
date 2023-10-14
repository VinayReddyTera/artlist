const express = require("express");
const router = express.Router();
const userservice = require("../service/users");
const axios = require("axios");
const qs = require("qs");
const jwt = require('jsonwebtoken');
const verifyToken = require("../utilities/verifyToken");

// api to save date given by users.
router.post('/saveDate',async (req,res,next)=>{
  const body = req.body.schedulePayload
  if (
    !body.subject ||
    !body.body ||
    !body.start ||
    !body.end ||
    !body.attendees
  ) {
    return res.status(204).send("Required fields missing");
  }
  userservice.schedule(req.body).then((data)=>{
    if(data.data.status == 'success'){
      userservice.saveDate(req.body,data.data.id).then((data)=>{
        res.json(data)
      }).catch((err)=>{
        next(err)
      })
    }
    else{
      let respons = {
        status : 204,
        data : 'Unable to schedule interview'
      }
      res.json(respons)
    }
  }).catch((err)=>{
    next(err)
  })
})

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
  
// api to remind user for job in somedays.
router.post('/remind',verifyToken,(req,res,next)=>{
    userservice.remind(req.body).then((data)=>{
        res.json(data)
      }).catch((err)=>{
        next(err)
      })
})

// api to send mail to shortlisted users
router.post('/sendMail',verifyToken,(req,res,next)=>{
  let users = req.body
  let count = 0
  let interviewScheduledCandidates = []
  for(i in users){
    userservice.generateOtp(users[i]).then((data)=>{
      if (data) {
        count+=1
        if(data.name){
          interviewScheduledCandidates.push(data.name)
        }
        if(count == users.length){
          if(users.length == interviewScheduledCandidates.length){
            let response = {
              mailNotSent : interviewScheduledCandidates,
              status : 204
            }
            res.json(response)
          }
          else{
            let response = {
              mailNotSent : interviewScheduledCandidates,
              status : 200
            }
            res.json(response)
          }
        }
      }
    }).catch((err)=>{
      next(err)
    })
  }
})

// api to give feedback
router.post('/giveFeedback',verifyToken,(req,res,next)=>{
  let payload = req.body;
  userservice.giveFeedback(payload).then((data)=>{
      res.json(data)
   }).catch((err)=>{
      next(err)
   })
})

//router to fetch forgotten password of user
router.post('/forgotPassword', function (req, res, next) {
  let userData = req.body
  userservice.forgotPassword(userData).then((data)=>{
      res.json(data);
  }).catch(err => next(err));
})

//router to collect demo requests
router.post('/scheduleDemo',verifyToken, function (req, res, next) {
  let userData = req.body
  userservice.demo(userData).then((data)=>{
      res.json(data);
  }).catch(err => next(err));
})

//router to reset password
router.post('/resetPassword', function (req, res, next) {
  let userData = req.body
  userservice.resetPassword(userData).then((data)=>{
      res.json(data);
  }).catch(err => next(err));
})

router.post("/mslogin",verifyToken, (req, res,next) => {
  const email = req.body.email
  userservice.findToken(email).then((response)=>{
    if(response.status == 200){
      const outlookURL =
      "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=" +
      process.env.MS_CLIENT_ID +
      "&response_type=code&redirect_uri=" +
      process.env.MS_REDIRECT_URI +
      "&response_mode=query&scope=offline_access%20user.read%20mail.read%20Calendars.ReadWrite%20Team.Create&state="+email;
    let obj = {
      status : 200,
      url : outlookURL
    }
    res.json(obj);
    }
    else if(response.status == 204){
      res.json(response)
    }
 }).catch((err)=>{
    next(err)
 })
});

router.get("/outlook/redirect",verifyToken, (req, res,next) => {
const codee = req.query.code;
const email = req.query.state;

let data = qs.stringify({
  client_id: process.env.MS_CLIENT_ID,
  scopes: ["https://graph.microsoft.com/Calendars.ReadWrite","https://graph.microsoft.com/Team.Create"],
  code:codee,
  redirect_uri: process.env.MS_REDIRECT_URI,
  grant_type: "authorization_code",
  client_secret: process.env.MS_CLIENT_SECRET,
});

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url:
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: data,
};

axios
  .request(config)
  .then(async (response) => {
    let data = response.data;
    data.email = email
    userservice.saveToken(data).then((response)=>{
      res.redirect('http://localhost:4200/dashboard/success')
   }).catch((err)=>{
      next(err)
   });
  })
  .catch((error) => {
      console.log("err", JSON.stringify(error))
    res.json(error)
  });
});

//api to fetch interviewer availability
router.post("/fetchAvailableSlots",verifyToken, async (req, res,next) => {
  userservice.fetchAvailableSlots(req.body).then((data)=>{
    res.json(data)
 }).catch((err)=>{
    next(err)
 })
});

//api to fetch dashboard data
router.post('/fetchDashboardData',verifyToken,(req,res,next)=>{
  userservice.fetchDashboardData(req.body).then((data)=>{
      res.json(data)
   }).catch((err)=>{
      next(err)
   })
})

//api to delete calendar integration
router.post('/delCalIntegration',verifyToken,(req,res,next)=>{
  userservice.delCalIntegration(req.body).then((data)=>{
      res.json(data)
   }).catch((err)=>{
      next(err)
   })
})

//api to reschedule interview
router.post('/rescheduleInterview',verifyToken,(req,res,next)=>{
  userservice.rescheduleInterview(req.body).then((data)=>{
    if(data.status == 200){
      userservice.schedule(req.body).then((data)=>{
        if(data.data.status == 'success'){
          userservice.saveDate(req.body,data.data.id).then((data)=>{
            res.json(data)
         }).catch((err)=>{
            next(err)
         })
        }
        else{
          let respons = {
            status : 204,
            data : 'Unable to schedule interview'
          }
          res.json(respons)
        }
      }).catch((err)=>{
        next(err)
     })
    }
    else{
      let respons = {
        status : 204,
        data : 'Unable to reschedule interview'
      }
      res.json(respons)
    }
   }).catch((err)=>{
      next(err)
   })
})

// api to update all
router.get('/updateAll',(req,res,next)=>{
  userservice.updateAll().then((data)=>{
      res.json(data)
   }).catch((err)=>{
      next(err)
   })
})

module.exports = router