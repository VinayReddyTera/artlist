const connection = require("../utilities/connection");
const ObjectId = require('mongodb').ObjectId; 
const userDB = {}
const nodemailer = require('nodemailer');
const axios = require("axios");
const qs = require("qs");
const bcrypt = require('bcryptjs');

userDB.generateArtistId = () => {
  return connection.getArtist().then((model)=>{
      return model.distinct("artistId").then((ids)=>{
          if(ids.length == 0){
              artistId = "I1001"
              return artistId
          }
          else{
              artistId = parseInt((ids[ids.length-1]).slice(1,))+1
              artistId = "I" + artistId
              return artistId 
          }
      })
  })
}

userDB.checkLoginUser = async (payload) => {
  const collection = await connection.getUsers();
  const collection1 = await connection.getArtist();
  let data;
    if(payload.role == 'user'){
      data = await collection.findOne({"email" : payload.email},{_id : 0});
    }
    else if(payload.role == 'artist'){
      data = await collection1.findOne({"email" : payload.email},{_id : 0});
    }
    else{
      let res = {
        status : 204,
        data : 'Invalid role'
      }
      return res
    }
    if (data) {
      let res = {
        status : 200,
        data : 'User exist'
      }
      return res
    }
    else{
      let res = {
        status : 204,
        data : "User Doesn't Exist"
      }
      return res
    }
}

userDB.register = async (data1) => {
  const collection = await connection.getUsers();
  const collection1 = await connection.getArtist();
  let data;
  if(data1.role == 'artist'){
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(data1.password, salt);
    let artistData = {
      name : data1.name,
      email : data1.email,
      password : hashpassword,
      phoneNo : data1.phoneNo,
      role : data1.roles
    }
    data = await collection1.create(artistData);
    if (data) {
      let id = await userDB.generateArtistId();
      if(id){
        const isUpdated = await collection1.updateOne({"email" : data1.email},{"$set" : {"artistId" : id}})
        if(isUpdated.modifiedCount == 1){
          let res = {
            status : 200,
            sendMail : true,
            data : 'Successfully registered'
          }
            return res
        }
        else{
          let res = {
            status : 204,
            sendMail : true,
            data : 'Successfully registered, but unable to update Artist Id'
          }
            return res
        }
      }
      else{
        let res = {
          status : 204,
          sendMail : true,
          data : 'Successfully registered, but unable to create Artist Id'
        }
          return res
      }
    }
    else{
      let res = {
        status : 204,
        sendMail : false,
        data : 'Unable to register'
      }
      return res
    }
  }
  else if(data1.role == 'user'){
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(data1.password, salt);
    let userData = {
      name : data1.name,
      email : data1.email,
      password : hashpassword,
      phoneNo : data1.phoneNo,
      role : data1.roles
    }
    data = await collection.create(userData);
    if(data){
      let res = {
        status : 200,
        sendMail : true,
        data : 'Successfully registered'
      }
      return res
    }
    else{
      let res = {
        status : 204,
        sendMail : false,
        data : 'Unable to register'
      }
      return res
    }
  }
  else{
    let res = {
      status :200,
      sendMail : false,
      data : 'Invalid role and unable to register'
    }
    return res
  }
}

userDB.checkPassword = async (data1) => {
  if(data1.role == 'artist'){
    const collection = await connection.getArtist();
    const data = await collection.findOne({"email" : data1.email});
    const checkPassword = await bcrypt.compare(data1.password,data.password);
    if (checkPassword) {
      let userData = {
        status: 200,
        data:{
        name : data.name,
        phoneNo : data.phoneNo,
        email : data.email,
        role : data.role,
        status : data.profileStatus,
        MCalendar : data?.MCalendar,
        GCalendar : data?.GCalendar,
        _id : data._id
      }
      }
        return userData;
    }
    else{
      let res = {
        status : 204,
        data : 'Incorrect Password'
      }
      return res
    }
  }
  else if(data1.role == "user"){
    const collection = await connection.getUsers();
    const data = await collection.findOne({"email" : data1.email});
    const checkPassword = await bcrypt.compare(data1.password,data.password);
    if (checkPassword) {
      let userData = {
        status: 200,
        data:{
        name : data.name,
        phoneNo : data.phoneNo,
        email : data.email,
        role : data.role,
        _id : data._id
      }
    }
        return userData;
    }
    else{
      let res = {
        status : 204,
        data : 'Incorrect Password'
      }
      return res
    }
  }
  else{
    let res = {
      status : 204,
      data : 'Invalid Role'
    }
    return res
  }
}

userDB.remind = async (data1,date) => {
    const collection = await connection.getuserDetails();
    const data = await collection.updateOne({ "resumeDetails._id" : new ObjectId(data1.resumeId),"resumeDetails.jdId" : data1.jdId},{"$set": { "resumeDetails.$.daystoRemind": data1.days ,"resumeDetails.$.datetoRemind": date,"resumeDetails.$.userStatus": `Remind on ${new Date(date).toDateString()}`}});
    if (data.modifiedCount == 1) {
        return true;
    }
    else
        return false;
}

userDB.saveDate = async (data1,id) => {
  let date = new Date(data1.date);
  let arr = [];
  arr.push(new Date(date.setDate(date.getDate()-1)).toDateString())
  arr.push(new Date(date.setDate(date.getDate()-4)).toDateString())
  arr.push(new Date(date.setDate(date.getDate()-10)).toDateString())
};

userDB.sendMail = (payload) =>{
    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.mailId,
            pass : process.env.pass
        }
    });

    let mailOptions = {
        from : process.env.mailId,
        to : payload.email,
        subject : payload.subject,
        html : payload.body
    }

    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error)
        }
        else{
            // console.log('Email sent : '+info.response);
            console.log('ok')
        }
    })
}

userDB.getReminder = async (date) => {
    // let date = "Sat May 27 2023"
    // let date = "Wed May 24 2023"
    const collection = await connection.getuserDetails();
    const data = await collection.aggregate([{$match : {"resumeDetails.reminderDates" : date}},{
        "$unwind": "$resumeDetails"
      }, {
        "$match": {"resumeDetails.reminderDates" : date}
      },{
        "$project": {
          "_id" : 0,
          "name" : 1,
          "phoneNo" : 1,
          "email" : 1,
          "resumeDetails.levelsCleared": 1,
          "resumeDetails.role": 1
        }
      }])
    if (data) {
        return data;
    }
    else return false;
}

userDB.demo = async (data1) => {
    const collection = await connection.demoList();
    const data = await collection.create(data1);
    if (data) {
        return true;
    }
    else return false;
}

userDB.checkDemo = async (data1) => {
    const collection = await connection.demoList();
    const data = await collection.findOne({ "$or": [ { "email": data1.email }, { "phoneNo": data1.phoneNo} ] });
    if (data) {
        return true;
    }
    else return false;
}

userDB.getPassword = async (payload) => {
  if(payload.role == "artist"){
    const collection = await connection.getArtist();
    const data = await collection.findOne({ "email" : payload.email},{_id:0});
    if (data) {
        let res = {
          status : 200,
          data : data
        }
        return res
    }
    else {
      let res = {
        status : 204,
        data : 'No user found'
      }
      return res
    };
  }
  else if(payload.role == 'user'){
    const collection = await connection.getUsers();
    const data = await collection.findOne({ "email" : payload.email},{_id:0});
    if (data) {
        let res = {
          status : 200,
          data : data
        }
        return res
    }
    else {
      let res = {
        status : 204,
        data : 'No user found'
      }
      return res
    };
  }
  else{
    let res = {
      status : 204,
      data : 'Invalid Role'
    }
    return res
  }
}

userDB.generateOtpForUsers = async (userData) => {
    let random = Math.floor(100000 + Math.random() * 900000)
    if(userData.role == 'artist'){
      const collection = await connection.getArtist();
      const data = await collection.updateOne({ "email" : userData.email},{"$set": {"otp" : random}});
      if (data.modifiedCount == 1) {
        let res = {
          status : 200,
          data : random
        }
        return res
      }
      else{
        let res = {
          status : 204,
          data : "Unable to generate otp, please try later!"
        }
        return res
      }
    }
    else if(userData.role == 'user'){
      const collection = await connection.getUsers();
      const data = await collection.updateOne({ "email" : userData.email},{"$set": {"otp" : random}});
      if (data.modifiedCount == 1) {
        let res = {
          status : 200,
          data : random
        }
        return res
      }
      else{
        let res = {
          status : 204,
          data : "Unable to generate otp"
        }
        return res
      }
    }
    else{
      let res = {
        status : 204,
        data : 'Invalid Role'
      }
      return res
    }
}

userDB.verifyPasswordResetOtp = async (data1) => {
  if(data1.role == 'artist'){
    const collection = await connection.getArtist();
    const data = await collection.findOne({ "email" : data1.email},{otp:1});
    if (data1.otp == data.otp) {
      let res = {
        status : 200,
        data : 'ok'
      }
      return res
    }
    else{
      let res = {
        status : 204,
        data : 'Incorrect Otp'
      }
      return res
    }
  }
  else if(data1.role == 'user'){
    const collection = await connection.getUsers();
    const data = await collection.findOne({ "email" : data1.email},{otp:1});
    if (data1.otp == data.otp) {
      let res = {
        status : 200,
        data : 'ok'
      }
      return res
    }
    else{
      let res = {
        status : 204,
        data : 'Incorrect Otp'
      }
      return res
    }
  }
  else{
    let res = {
      status : 204,
      data : 'Invalid Role'
    }
    return res
  }
}

userDB.updatePasswordForUsers = async (userData) => {
  if(userData.role == 'artist'){
    const collection = await connection.getArtist();
    const data = await collection.updateOne({ "email" : userData.email},{"$set": {"password" : userData.password}});
    if (data.modifiedCount == 1 && data.acknowledged == true) {
        let res = {
            status :200,
            data : "Successfully updated password"
        }
        return res
    }
    else if(data.acknowledged == true && data.modifiedCount == 0 ){
        let res = {
            status :204,
            data : "Password cannot be old password"
        }
        return res
    }
    else{
        return false
    }
  }
  else if(userData.role == 'user'){
    const collection = await connection.getUsers();
    const data = await collection.updateOne({ "email" : userData.email},{"$set": {"password" : userData.password}});
    if (data.modifiedCount == 1 && data.acknowledged == true) {
        let res = {
            status :200,
            data : "Successfully updated password"
        }
        return res
    }
    else if(data.acknowledged == true && data.modifiedCount == 0 ){
        let res = {
            status :204,
            data : "Password cannot be old password"
        }
        return res
    }
    else{
        return false
    }
  }
  else{
    let res = {
      status : 204,
      data : 'Invalid Role'
    }
    return res
  }
}

userDB.updateFeedback = async (payload) => {
  const collection = await connection.feedback();
  const data = await collection.updateOne(
    { "email": payload.email },
    {
       $setOnInsert: {
          "name": payload.name,
          "email": payload.email
       },
       $push: {
          "feedbacks": {
             "feedbackType": payload.type,
             "feedback": payload.feedback
          }
       }
    },
    { upsert: true }
 )
 
  if (data.modifiedCount == 1 || data.upsertedCount == 1) {
      return true;
  }
  else
      return false;
}

userDB.saveToken = async (data1) => {
  const collection = await connection.getToken();
  const collection1 = await connection.getUsers();
  const data = await collection.create(data1);
  const update = await collection1.updateOne({"email":data1.email},{$set:{MCalendar:true}});
  if (data) {
      return true;
  }
  else
      return false;
}

userDB.findToken = async (email) => {
  const collection = await connection.getToken();
  const data = await collection.findOne({"email":email},{_id:0});
  if (data) {
      return false;
  }
  else
      return true;
}

async function refresh(token,email) {
  let data = qs.stringify({
    client_id: process.env.MS_CLIENT_ID,
    scopes: ["https://graph.microsoft.com/Calendars.ReadWrite","https://graph.microsoft.com/Team.Create"],
    grant_type: "refresh_token",
    refresh_token : token.refresh_token,
    client_secret: process.env.MS_CLIENT_SECRET,
  });

  let refreshConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url:
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data,
  };

  console.log(165,token.refresh_token)

  return new Promise((resolve, reject) => {
    try {
      axios
      .request(refreshConfig)
      .then(async (response) => {
        let data = response.data;
        data.email = email
        const collection = await connection.getToken();
        await collection.replaceOne(
          {
            "email": email,
          },
          data
        );
        resolve('done')
      })
      .catch((error) => {
        return error
      });
} catch (err) {
     reject(err);
}
})
}

async function fetchAvailableSlots(payload) {
  const collection = await connection.getToken();
  const collection1 = await connection.getUsers();
  let tagData = await collection1.findOne({"_id":new ObjectId(payload.id)},{_id:0})
  let tagEmail = tagData.email
  let date = new Date()
  date.setDate(date.getDate()+7)
  const token = await collection.findOne({"email":tagEmail});
  let data = JSON.stringify({        
    "Schedules": [payload.email],
    "StartTime": {
        "dateTime": new Date(),
        "timeZone": "India Standard Time"
    },
    "EndTime": {
        "dateTime": date,
        "timeZone": "India Standard Time"
    },
    "availabilityViewInterval": "30"
})
  
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://graph.microsoft.com/v1.0/me/calendar/getschedule",
    headers: {
      Prefer: 'outlook.timezone="india standard time"',
      Authorization: "Bearer " + token["access_token"],
      "Content-Type": "application/json",
    },
    data: data,
  };
  return new Promise((resolve, reject) => {
    try {
        axios
      .request(config)
      .then((response) => {
        resolve(response.data)
      })
      .catch(async (error) => {
        console.log(502,error.message)
        let res = await refresh(token,tagEmail);
        console.log('token refreshed by fetching schedules')
        if(res == "done"){
          resolve(fetchAvailableSlots(payload));
        }
        else{
          reject("unable to fetch")
        }
      });
} catch (err) {
      console.log(err);
      reject(err);
}
})
}

async function schedule(payload) {
  let body = payload.schedulePayload
  const collection = await connection.getToken();
  const collection1 = await connection.getUsers();
  let tagData = await collection1.findOne({"_id":new ObjectId(payload.id)},{_id:0})
  const token = await collection.findOne({"email":tagData.email});
  let attendees = [];
  
  body.attendees.forEach(async (attendee) => {
    attendees.push({
      emailAddress: {
        address: attendee.email,
        name: attendee.name,
      },
      type: "required",
    });
  });
  
  let data = JSON.stringify({
    subject: body.subject,
    body: {
      contentType: "HTML",
      content: `Please be ready at the given time for the interview. Keep your webcam on. If you have trouble please connect with ${tagData.name}, PhoneNo : ${tagData.phoneNo}, email : ${tagData.email}`,
    },
    start: {
      dateTime: body.start,
      timeZone: "India Standard Time",
    },
    end: {
      dateTime: body.end,
      timeZone: "India Standard Time",
    },
    location: {
      displayName: body.subject,
    },
    attendees: attendees,
    allowNewTimeProposals: true,
    isOnlineMeeting: true,
    onlineMeetingProvider: "teamsForBusiness",
  });
  
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://graph.microsoft.com/v1.0/me/events",
    headers: {
      Prefer: 'outlook.timezone="india standard time"',
      Authorization: "Bearer " + token["access_token"],
      "Content-Type": "application/json",
    },
    data: data,
  };
  
  return new Promise((resolve, reject) => {
    try {
      axios
      .request(config)
      .then((response) => {
        let data = {
          status : 'success',
          id : response.data.id
        }
        resolve(data)
      })
      .catch(async (error) => {
        let res = await refresh(token,tagData.email);
        console.log('token refreshed by scheduling Interview')
        if(res == "done"){
          resolve(schedule(body));
        }
        else{
          reject("unable to schedule interview")
        }
      });
  } catch (err) {
     console.log(err);
     reject(err);
  }
  })
}

userDB.fetchAvailableSlots = async (payload) => {
  let data = await fetchAvailableSlots(payload)
  if(data){
    return data
  }
  else return false
}

userDB.schedule = async (body) => {
  const response = await schedule(body);
  if(response){
    return response
  }
  else{
    return false
  }
}

userDB.delCalIntegration = async (data1) => {
  const collection = await connection.getToken();
  const collection1 = await connection.getUsers();
  const data = await collection.deleteOne({"email":data1.email});
  const update = await collection1.updateOne({"email":data1.email},{$set:{MCalendar:false}});
  if (data) {
      return true;
  }
  else
      return false;
}

async function rescheduleInterview(payload){
  const collection = await connection.getToken();
  const collection1 = await connection.getUsers();
  let tagData = await collection1.findOne({"_id":new ObjectId(payload.id)},{_id:0})
  const token = await collection.findOne({"email":tagData.email});
  
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "https://graph.microsoft.com/v1.0/me/events/"+payload.eventId,
    headers: {
      Prefer: 'outlook.timezone="india standard time"',
      Authorization: "Bearer " + token["access_token"],
      "Content-Type": "application/json",
    }
  };
  
  return new Promise((resolve, reject) => {
    try {
      axios
      .request(config)
      .then((response) => {
        let obj = {
          status : 200,
          data : 'Interview deleted successfully'
        }
        resolve(obj)
      })
      .catch(async (error) => {
        // console.log(error.response.data.error)
        if(error.response.data.error.code == 'ErrorItemNotFound'){
          let obj = {
            status : 204,
            data : 'event id problem'
          }
          resolve(obj)
        }
        else{
          let res = await refresh(token,tagData.email);
          console.log('token refreshed by rescheduling Interview')
          if(res == "done"){
            console.log('refreshed')
            resolve(rescheduleInterview(payload));
          }
          else{
            reject("unable to schedule interview")
          }
        }
      });
  } catch (err) {
     console.log(err);
     reject(err);
  }
  })
}

userDB.rescheduleInterview = async (body) => {
  const response = await rescheduleInterview(body);
  if(response.status == 200){
    return response.data
  }
  else{
    return false
  }
}

userDB.fetchDashboardData = async (body) => {
  return 'ok'
}

userDB.updateAll = async () => {
  const collection = await connection.getArtist();
  const data = await collection.updateMany({},{$set:{MCalendar:false,GCalendar:false}});
  if (data.modifiedCount>1) {
      return true;
  }
  else
      return false;
}

module.exports = userDB