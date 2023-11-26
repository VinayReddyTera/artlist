const userDB = require('../model/users');
const nodemailer = require('nodemailer');
const userService = {}
const jwt = require('jsonwebtoken');
const ejs = require('ejs')

userService.login=(data)=>{
  return userDB.checkLoginUser(data).then((userData)=>{
      if(userData.status == 200){
        return userDB.checkPassword(data).then((authData)=>{
            if(authData.status == 200){
              return authData
            }
            else{
                return authData
            }
        })
      }
      else{
        return userData
      }
  })
}

userService.register=(data)=>{
    return userDB.checkLoginUser(data).then((userData)=>{
        if(userData.status == 204 && userData.data == "User Doesn't Exist"){
            return userDB.register(data).then((isCreated)=>{
                if(isCreated){
                  let payload1;
                  let role = data.role;
                  if(isCreated.sendMail == true){
                    if(isCreated.status == 200){
                      payload1 = {
                          "subject" : `Successfully Registered`,
                          "email" : data.email,
                          "body" : '',
                          "attachment" : ""
                      }
                      let payload = {
                        "button" : false,
                        "name" : data.name,
                        "body" : `You have successfully registered as an ${role} for Artlist`,
                      }
                      let templatePath = 'templates/welcome.html';
                      ejs.renderFile(templatePath,payload,(err,html)=>{
                        if(err){
                          console.log(err)
                        }
                        else{
                          payload1.body = html;
                          userService.sendMail(payload1)
                        }
                      })
                  }
                  else{
                      payload1 = {
                          "subject" : `Artlist Registration Status`,
                          "email" : data.email,
                          "body" : "",
                          "attachment" : ""
                      }
                      let payload = {
                        "button" : false,
                        "name" : data.name,
                        "body" : `You registration Status is : ${isCreated.data}`,
                      }
                      let templatePath = 'templates/welcome.html';
                      ejs.renderFile(templatePath,payload,(err,html)=>{
                        if(err){
                          console.log(err)
                        }
                        else{
                          payload1.body = html;
                          userService.sendMail(payload1)
                        }
                      })
                  }
                  }
                  return isCreated
                }
                else{
                    let res = {
                        status:204,
                        data:'Unable to register'
                    }
                    return res
                }
            })
        }
        else{
          if(userData.status == 200){
            let res = {
              status : 204,
              data : "User already exists, try logging in!"
            }
            return res
          }
          return userData
        }
    })
}

userService.sendMail=(payload)=>{
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

userService.forgotPassword = (userData,origin) =>{
    return userDB.checkLoginUser(userData).then((data)=>{
        if(data.status == 204){
            return data
        }
        else{
            return userDB.generateOtpForUsers(userData).then((data)=>{
                if(data.status == 200){
                    let resetData = {
                        email : userData.email,
                        otp : data.data,
                        role : userData.role
                    }
                    const expirationTime = Math.floor(Date.now() / 1000) + 7200;
                    const token = jwt.sign({data:resetData,exp : expirationTime},process.env.JWT_Secret);
                    let payload1 = {
                    "subject" : 'Reset Your Password',
                    "email" : userData.email,
                    "body" : ""
                      }
                let data = {
                  "button" : 'Reset Password',
                  "name":false,
                  "url":`${origin}/account/reset-password/${token}`,
                  "body" : `Click below link to reset your password. The below link expires in 2 hours`,
                }
                let templatePath = 'templates/welcome.html';
                ejs.renderFile(templatePath,data,(err,html)=>{
                  if(err){
                    console.log(err)
                  }
                  else{
                    payload1.body = html;
                    userService.sendMail(payload1)
                  }
                })
                let res = {
                    status: 200,
                    data: "Password reset link sent to your mail"
                }
                return res
                }
                else{
                    return data
                }
            })
        }
    })
}

userService.resetPassword=(payload)=>{
    return userDB.verifyPasswordResetOtp(payload).then((data)=>{
        if(data.status == 200){
            return userDB.updatePasswordForUsers(payload).then((data)=>{
                if(data){
                    return data
                }
                else{
                    let res = {
                        status : 204,
                        data : "Unable to update password"
                    }
                    return res
                }
            })
        }
        else{
            return data
        }
    })
}

userService.changePassword=(payload)=>{
  return userDB.checkPassword(payload).then((data)=>{
    if(data.status == 200){
      let payload1 = {
        email : payload.email,
        password: payload.newPassword,
        role:payload.role
      }
      return userDB.updatePasswordForUsers(payload1).then((data)=>{
        if(data){
            return data
        }
        else{
            let res = {
                status : 204,
                data : "Unable to update password"
            }
            return res
        }
    })
    }
    else{
      return data
    }
  })
}

userService.updateProfile=(payload)=>{
  return userDB.updateProfile(payload).then((data)=>{
    if(data){
      return data
    }
    else{
      let response = {
        status : 204,
        data : 'unable to update profile'
      }
      return response
    }
  })
}

userService.sendVerifyEmail=(userData,host,protocol)=>{
  return userDB.checkLoginUser(userData).then((data)=>{
    if(data.status == 204){
        return data
    }
    else{
      let resetData = {
        email : userData.email,
        role : userData.role
    }
    const expirationTime = Math.floor(Date.now() / 1000) + 7200;
    const token = jwt.sign({data:resetData,exp : expirationTime},process.env.JWT_Secret);
    let payload1 = {
    "subject" : 'Verify Email',
    "email" : userData.email,
    "body" : ""
    }
    let data = {
      "button" : 'Verify Email',
      "name" : false,
      "url":`${protocol}://${host}/verifyEmail/${token}`,
      "body" : `Click below link to verify email. The below link expires in 2 hours`,
    }
    let templatePath = 'templates/welcome.html';
    ejs.renderFile(templatePath,data,(err,html)=>{
      if(err){
        console.log(err)
      }
      else{
        payload1.body = html;
        userService.sendMail(payload1)
      }
    })
    let res = {
        status: 200,
        data: "Email Verification link sent to your email"
    }
    return res
    }
})
}

userService.verifyEmail=(payload)=>{
  return userDB.verifyEmail(payload).then((data)=>{
    if(data){
      return data
    }
    else{
      let response = {
        status : 204,
        data : 'unable to validate email'
      }
      return response
    }
  })
}

userService.addSkill=(payload,id)=>{
  return userDB.addSkill(payload,id).then((data)=>{
    if(data){
      return data
    }
    else{
      let response = {
        status : 204,
        data : 'unable to add skill'
      }
      return response
    }
  })
}

userService.getArtistSkill=(id)=>{
  return userDB.getArtistSkill(id).then((data)=>{
    if(data){
      return data
    }
    else{
      let response = {
        status : 204,
        data : 'unable to fetch skill data'
      }
      return response
    }
  })
}

userService.updateArtistSkill=(payload,id)=>{
  return userDB.updateArtistSkill(payload,id).then((data)=>{
    if(data){
      return data
    }
    else{
      let response = {
        status : 204,
        data : 'unable to update skill data'
      }
      return response
    }
  })
}

userService.addApprover=(payload)=>{
  return userDB.checkLoginUser(payload).then((userData)=>{
    if(userData.status == 204 && userData.data == "User Doesn't Exist"){
      return userDB.addApprover(payload).then((data)=>{
        if(data){
          let payload1;
          if(data.sendMail == true){
            if(data.status == 200){
              payload1 = {
                  "subject" : `Successfully Registered`,
                  "email" : payload.email,
                  "body" : "",
                  "attachment" : ""
              }
          }
          let data = {
            "button" : false,
            "name":payload.name,
            "body" : `You have successfully registered as an Approver for Artlist`,
          }
          let templatePath = 'templates/welcome.html';
          ejs.renderFile(templatePath,data,(err,html)=>{
            if(err){
              console.log(err)
            }
            else{
              payload1.body = html;
              userService.sendMail(payload1)
            }
          })
          }
          return data
        }
        else{
          let response = {
            status : 204,
            data : 'unable to add approver'
          }
          return response
        }
      })
  }
  else{
    if(userData.status == 200){
      let res = {
        status : 204,
        data : "Approver already exists"
      }
      return res
    }
    return userData
  }
  })
}

userService.allApprovers=()=>{
  return userDB.allApprovers().then((data)=>{
    if(data){
      return data
    }
    else{
      let response = {
        status : 204,
        data : 'unable to fetch approvers'
      }
      return response
    }
  })
}

userService.editApprover=(payload)=>{
  return userDB.editApprover(payload).then((data)=>{
    if(data){
      return data
    }
    else{
      let response = {
        status : 204,
        data : 'unable to update'
      }
      return response
    }
  })
}

userService.pendingArtists=(id)=>{
  return userDB.getSkill(id).then((skillData)=>{
    if(skillData){
      return userDB.pendingArtists(skillData).then((data)=>{
        if(data){
          return data
        }
        else{
          let response = {
            status : 204,
            data : 'unable to fetch artists'
          }
          return response
        }
      })
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch approver skill data'
      }
      return res
    }
  })
}

userService.approveSkill=(payload,id)=>{
  return userDB.approveSkill(payload,id).then((skillData)=>{
    if(skillData){
      return skillData
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to approver skill data'
      }
      return res
    }
  })
}

userService.getArtistHistory=(id)=>{
  return userDB.getArtistHistory(id).then((artistHistory)=>{
    if(artistHistory){
      return artistHistory
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch history data'
      }
      return res
    }
  })
}

userService.getAvailable=(id)=>{
  return userDB.getAvailable(id).then((available)=>{
    if(available){
      return available
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch available days data'
      }
      return res
    }
  })
}

userService.updateAvailable=(payload,id)=>{
  return userDB.updateAvailable(payload,id).then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to update available days data'
      }
      return res
    }
  })
}

userService.updateinaug=(payload,id)=>{
  return userDB.updateinaug(payload,id).then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to update Inauguration data'
      }
      return res
    }
  })
}

userService.updatewishes=(payload,id)=>{
  return userDB.updatewishes(payload,id).then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to update wishes data'
      }
      return res
    }
  })
}

userService.getArtists=()=>{
  return userDB.getArtists().then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch artist data'
      }
      return res
    }
  })
}

userService.fetchAvailable=(id)=>{
  return userDB.fetchAvailable(id).then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch booking slots'
      }
      return res
    }
  })
}

userService.bookArtist=async (payload)=>{
  let available= await userDB.fetchAvailable(payload.artistId);
  let availableData;
  if(available.status == 200){
    availableData = available.data;
    if(payload.type == 'hourly'){
      let availability;
      const start = new Date(payload.from).getHours()
      const end = new Date(payload.to).getHours()
      for(let i of availableData.hourly){
        if(new Date(payload.date).toDateString() == new Date(i.date).toDateString()){
          availability = i.availability;
          break;
        }
      }
      for(let i=start;i<end;i++){
        if(availability[i] == 0){
          let res= {
            status : 204,
            data: 'Slot already booked'
          }
          return res
        }
      }
    }
    else if(payload.type == 'fullDay'){
      let isFound = false;
      for(let i of availableData.fullDay){
        if(new Date(i).toDateString() == new Date(payload.date).toDateString()){
          isFound = true;
          break;
        }
      }
      if(!isFound){
        let res= {
          status : 204,
          data: 'Slot already booked'
        }
        return res
      }
    }
    else if(payload.type == 'event'){
      let isFound = false;
      for(let i of availableData.event){
        if(new Date(i.date).toDateString() == new Date(payload.date).toDateString()){
          for(let j of i.slots){
            if(j == payload.slot){
              isFound = true;
              break;
            }
          }
        }
      }
      if(!isFound){
        let res= {
          status : 204,
          data: 'Slot already booked'
        }
        return res
      }
    }
    return userDB.bookArtist(payload).then((data)=>{
      if(data){
        // Mark Your Calendar: Event Rescheduled Successfully!
        let roles = ['artist','user'];
        for(let i of payload){
          for(let j of roles){
            i.role = j;
            let payload1 = {
              "subject" : 'Locked and Loaded: Your Event Booking Confirmation',
              "email" : '',
              "body" : ""
              }
              let slotMap = {
                1: '04:00 A.M - 09:00 A.M',
                2: '09:00 A.M - 02:00 P.M',
                3: '02:00 P.M - 07:00 P.M',
                4: '07:00 P.M - 12:00 A.M',
                5: '12:00 A.M - 04:00 A.M'
              }
              if(j == 'user'){
                payload1.email = i.userEmail;
              }
              else{
                payload1.email = i.artistEmail;
              }
              if(i.type == 'hourly'){
                i.from = i.from.toLocaleString().replace(/:\d{2}\s/, '');
                i.to = i.to.toLocaleString().replace(/:\d{2}\s/, '');
              }
              else if(i.type == 'event'){
                i.slot = slotMap[i.slot]
              }
              let templatePath = 'templates/booking.html';
              ejs.renderFile(templatePath,i,(err,html)=>{
                if(err){
                  console.log(err)
                }
                else{
                  payload1.body = html;
                  userService.sendMail(payload1)
                }
              })
          }
        }
        return data
      }
      else{
        let res= {
          status : 204,
          data: 'Unable to book artist now'
        }
        return res
      }
    })
  }
  else{
    let res= {
      status : 204,
      data: 'Unable to verify slot and book artist'
    }
    return res
  }
}

userService.fetchHistory=(payload)=>{
  return userDB.fetchHistory(payload).then((data)=>{
    if(data){
      if(data.status == 200){
        let userData = data.userData;
        let history = data.history;
        let output = userService.generateOutput(payload.role,userData,history)
        let res= {
          status : 200,
          data: output
        }
        return res
      }
      else{
        return data
      }
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch history'
      }
      return res
    }
  })
}

userService.generateOutput = (role,userData,history)=>{
  // Create a mapping of userData based on _id
  const userDataMap = new Map(userData.map(user => [String(user._id), user]));

  let output = history.map(entry => {
    let newData;
    if(role == 'user'){
      newData = userDataMap.get(entry.artistId);
    }
    else{
      newData = userDataMap.get(entry.userId);
    }
    if (newData) {
      entry.candName = newData.name;
      entry.email = newData.email;
      entry.phoneNo = newData.phoneNo;
    }
    // if(role == 'user'){
    //   delete entry.artistId;
    // }
    // {
    //   delete entry.userId;
    // }
    return entry;
  });
  return output
}

userService.giveArtistFeedback=(payload)=>{
  return userDB.giveArtistFeedback(payload).then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to take feedback'
      }
      return res
    }
  })
}

userService.fetchNewRequests=(payload)=>{
  return userDB.fetchNewRequests(payload).then((data)=>{
    if(data){
      if(data.status == 200){
        let userData = data.userData;
        let history = data.history;
        let output = userService.generateOutput(payload.role,userData,history)
        let res= {
          status : 200,
          data: output
        }
        return res
      }
      else if(data.status == 204){
        return data
      }
      else{
        let res= {
          status : 204,
          data: 'Unable to fetch new requests'
        }
        return res
      }
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch new requests'
      }
      return res
    }
  })
}

userService.updateEvent=(payload)=>{
  return userDB.updateEvent(payload).then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to update now'
      }
      return res
    }
  })
}

userService.updateBooking=async(payload)=>{
  let available= await userDB.fetchAvailable(payload.data.artistId);
  let availableData;
  if(available.status == 200){
    availableData = available.data;
    if(payload.data.type == 'hourly'){
      let availability;
      const start = new Date(payload.data.from).getHours()
      const end = new Date(payload.data.to).getHours()
      for(let i of availableData.hourly){
        if(new Date(payload.data.date).toDateString() == new Date(i.date).toDateString()){
          availability = i.availability;
          break;
        }
      }
      for(let i=start;i<end;i++){
        if(availability[i] == 0){
          let res= {
            status : 204,
            data: 'Slot already booked'
          }
          return res
        }
      }
    }
    else if(payload.data.type == 'fullDay'){
      let isFound = false;
      for(let i of availableData.fullDay){
        if(new Date(i).toDateString() == new Date(payload.data.date).toDateString()){
          isFound = true;
          break;
        }
      }
      if(!isFound){
        let res= {
          status : 204,
          data: 'Slot already booked'
        }
        return res
      }
    }
    else if(payload.data.type == 'event'){
      let isFound = false;
      for(let i of availableData.event){
        if(new Date(i.date).toDateString() == new Date(payload.data.date).toDateString()){
          for(let j of i.slots){
            if(j == payload.data.slot){
              isFound = true;
              break;
            }
          }
        }
      }
      if(!isFound){
        let res= {
          status : 204,
          data: 'Slot already booked'
        }
        return res
      }
    }
    return userDB.updateBooking(payload).then((data)=>{
      if(data){
        return data
      }
      else{
        let res= {
          status : 204,
          data: 'Unable to reschedule'
        }
        return res
      }
    })
  }
  else{
    let res= {
      status : 204,
      data: 'Unable to verify slot and update booking'
    }
    return res
  }
}

userService.getReminder=()=>{
  return userDB.getReminder().then((data)=>{
      if(data){
        let role = ['user','artist']
        for(let i of data){
          for(let j of role){
            let payload = {
              "subject":"",
              "email":"",
              "body":"",
              "attachment":""
            }
            i.role = j;
            let slotMap = {
              1: '04:00 A.M - 09:00 A.M',
              2: '09:00 A.M - 02:00 P.M',
              3: '02:00 P.M - 07:00 P.M',
              4: '07:00 P.M - 12:00 A.M',
              5: '12:00 A.M - 04:00 A.M'
            }
            if(j == 'user'){
              payload.email = i.userEmail;
            }
            else{
              payload.email = i.artistEmail;
            }
            if(new Date().toDateString() == new Date(i.date).toDateString()){
              if(i.type == 'hourly'){
                i.from = i.from.toLocaleString().replace(/:\d{2}\s/, '');
                i.to = i.to.toLocaleString().replace(/:\d{2}\s/, '');
                payload.subject = 'Reminder: Hourly Event Today'
              }
              else if(i.type == 'fullDay'){
                payload.subject = 'Reminder: Full Day Event Today'
              }
              else if(i.type == 'event'){
                i.slot = slotMap[i.slot]
                payload.subject = 'Reminder: Event Today'
              }
            }
            else{
              if(i.type == 'hourly'){
                i.from = i.from.toLocaleString().replace(/:\d{2}\s/, '');
                i.to = i.to.toLocaleString().replace(/:\d{2}\s/, '');
                payload.subject = `Reminder: Hourly Event on ${new Date(i.date).toDateString()}`
              }
              else if(i.type == 'fullDay'){
                payload.subject = `Reminder: Full Day Event on ${new Date(i.date).toDateString()}`
              }
              else if(i.type == 'event'){
                i.slot = slotMap[i.slot]
                payload.subject = `Reminder: Event on ${new Date(i.date).toDateString()}`
              }
            }
            let templatePath = 'templates/reminder.html';
            ejs.renderFile(templatePath,i,(err,html)=>{
              if(err){
                console.log(err)
              }
              else{
                payload.body = html;
                userService.sendMail(payload)
              }
            })
          }
        }
        return 'ok'
      }
      else{
          let res = {
              status : 204,
              data : "failed"
          }
          return res
      }
  })
}

module.exports = userService