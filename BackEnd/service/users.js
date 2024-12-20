const userDB = require('../model/users');
const nodemailer = require('nodemailer');
const userService = {}
const jwt = require('jsonwebtoken');
const ejs = require('ejs');

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
        cc : payload?.cc,
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
            return userDB.generateOtpForUsers(userData).then((otpData)=>{
                if(otpData.status == 200){
                    let resetData = {
                        email : userData.email,
                        otp : otpData.data,
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

userService.addSkill=(payload,id,artistData,origin)=>{
  return userDB.addSkill(payload,id).then(async(data)=>{
    if(data){
      let payload1 = {
        "subject" : 'New Skill Added',
        "email" : artistData.email,
        "body" : ""
        }
        let mailData = {
          "button" : false,
          "name" : artistData.name,
          "body" : `Congratulations, You have successfully added ${payload.name} to your skillset. Please be patient until our team reviews it.`,
        }
        let templatePath = 'templates/welcome.html';
        ejs.renderFile(templatePath,mailData,(err,html)=>{
          if(err){
            console.log(err)
          }
          else{
            payload1.body = html;
            userService.sendMail(payload1)
          }
        })
        let tagMailList = await userDB.fetchTag(payload.name)
        if(tagMailList){
          for(let i of tagMailList){
            let tagpayload = {
              "subject" : 'New Skill Approval Request',
              "email" : i.email,
              "body" : ""
              }
              let tagmailData = {
                "button" : 'Login',
                "url": `${origin}/account/login`,
                "name" : i.name,
                "body" : `You have new skill approval request with skill name ${payload.name}, Please login and review.`,
              }
              // let templatePath = 'templates/welcome.html';
              ejs.renderFile(templatePath,tagmailData,(err,html)=>{
                if(err){
                  console.log(err)
                }
                else{
                  tagpayload.body = html;
                  userService.sendMail(tagpayload)
                }
              })
          }
        }
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

userService.updateArtistSkill=(payload,artistData,origin)=>{
  return userDB.updateArtistSkill(payload,artistData._id).then(async(data)=>{
    if(data){
      if(data.status == 200){
        let text = `skill name : ${payload.name}`;
        let arr = []
        if(payload.genre.length > 0){
          for(let i of payload.genre){
            if(i.validated == 'nv'){
              arr.push(i.name)
            }
          }
        }
        if(arr.length>0){
          text = text + `, genre name : ${arr.toString()}`;
        }
        let payload1 = {
          "subject" : 'Skill Updated',
          "email" : artistData.email,
          "body" : ""
          }
          let mailData = {
            "button" : false,
            "name" : artistData.name,
            "body" : `Congratulations, You have successfully updated ${text}. Please be patient until our team reviews it.`,
          }
          let templatePath = 'templates/welcome.html';
          ejs.renderFile(templatePath,mailData,(err,html)=>{
            if(err){
              console.log(err)
            }
            else{
              payload1.body = html;
              userService.sendMail(payload1)
            }
          })
          let tagMailList = await userDB.fetchTag(payload.name)
          if(tagMailList){
            for(let i of tagMailList){
              let tagpayload = {
                "subject" : 'Updated Skill Approval Request',
                "email" : i.email,
                "body" : ""
                }
                let tagmailData = {
                  "button" : 'Login',
                  "url": `${origin}/account/login`,
                  "name" : i.name,
                  "body" : `You have an updated skill approval request with ${text}. Please login and review.`,
                }
                // let templatePath = 'templates/welcome.html';
                ejs.renderFile(templatePath,tagmailData,(err,html)=>{
                  if(err){
                    console.log(err)
                  }
                  else{
                    tagpayload.body = html;
                    userService.sendMail(tagpayload)
                  }
                })
            }
          }
      }
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

userService.approveSkill=(payload,userData)=>{
  return userDB.approveSkill(payload,userData._id).then((skillData)=>{
    if(skillData){
      if(skillData.status == 200){
        let payload1 = {
          "subject" : 'Skill Status',
          "email" : payload.email,
          "body" : ""
          }
          let mailData = {
            "name" : payload.name,
            "body" : `We have completed the review of the skills you recently submitted. Skills reviewed by ${userData.name}.`,
            "isApproved" : false,
            "isRejected" : false,
            "approved" : {'skillName':null,'genreName':[]},
            "rejected" : {'skillName':null,'genreName':[]},
            "tagName" : userData.name,
            "tagPhone" : userData.phoneNo,
            "tagEmail" : userData.email,
          }
          if(payload?.skillName){
            if(payload?.status == 'a'){
              mailData.approved.skillName = payload?.skillName;
              mailData.isApproved = true;
            }
            else if(payload?.status == 'r'){
              mailData.rejected.skillName = payload?.skillName;
              mailData.isRejected = true;
            }
          }
          if(payload.genre.length>0){
            for(let i of payload.genre){
              if(i?.name){
                if(i?.status == 'a'){
                  mailData.approved.genreName.push(i?.name);
                  mailData.isApproved = true;
                }
                else if(i?.status == 'r'){
                  mailData.rejected.genreName.push(i?.name);
                  mailData.isRejected = true;
                }
              }
            }
          }
          let templatePath = 'templates/skill.html';
          ejs.renderFile(templatePath,mailData,(err,html)=>{
            if(err){
              console.log(err)
            }
            else{
              payload1.body = html;
              userService.sendMail(payload1)
            }
          })
      }
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
    return userDB.bookArtist(payload).then(async(data)=>{
      if(data){
        let dataPayload = {
          userId : payload.userId,
          artistId : payload.artistId
        }
        let userData = await userDB.fetchUserAndArtist(dataPayload);
        if(userData){
        // Mark Your Calendar: Event Rescheduled Successfully!
        payload = {...payload,...userData};
        let roles = ['artist','user'];
        let slotMap = {
          1: '04:00 A.M - 09:00 A.M',
          2: '09:00 A.M - 02:00 P.M',
          3: '02:00 P.M - 07:00 P.M',
          4: '07:00 P.M - 12:00 A.M',
          5: '12:00 A.M - 04:00 A.M'
        }
        if(payload.type == 'hourly'){
          payload.from = userService.formatDate(payload.from);
          payload.to = userService.formatDate(payload.to);
        }
        else if(payload.type == 'event'){
          payload.slot = slotMap[payload.slot]
        }
        for(let j of roles){
          payload.role = j;
          let payload1 = {
            "subject" : 'Locked and Loaded: Your Event Booking Confirmation',
            "email" : '',
            "body" : ""
            }
            if(payload.type == 'hourly'){
              payload.body = `Booking successful for hourly Event on ${new Date(payload.date).toDateString()}. `
            }
            else if(payload.type == 'fullDay'){
              payload.body = `Booking successful for Full Day Event on ${new Date(payload.date).toDateString()}. `
            }
            else if(payload.type == 'event'){
              payload.body = `Booking successful for Event on ${new Date(payload.date).toDateString()}. `
            }
            if(j == 'user'){
              payload1.email = payload.candEmail;
              payload.body = payload.body+`You have hired ${payload.artistName} as ${payload.name}.`
            }
            else{
              payload1.email = payload.artistEmail;
              payload.body = payload.body+`You have been hired by ${payload.candName} as ${payload.name}.`
            }
            let templatePath = 'templates/reminder.html';
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
        return data
        }
        else{
          let res= {
            status : 200,
            data: 'Booking Successful but unable to send confirmation email'
          }
          return res
        }
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

userService.fetchUnpaidCommissions=(payload)=>{
  return userDB.fetchUnpaidCommissions(payload).then((data)=>{
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

userService.fetchAllUnpaidCommissions=(payload)=>{
  return userDB.fetchAllUnpaidCommissions(payload).then((data)=>{
    if(data){
      if(data.status == 200){
        let userData = data.userData;
        let history = data.history;
        let output = userService.generateOutput(payload.role,userData,history)
        let modified = userService.modifyAllUnpaid(output)
        let res= {
          status : 200,
          data: modified
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

userService.modifyAllUnpaid = (inputArray) => {
  // Create an object to store grouped data
  const groupedData = {};

  // Iterate through the input array and group data based on artistId
  inputArray.forEach(item => {
    const { artistId, candName, email, phoneNo, commission, ...rest } = item;

    // Create a key based on artistId
    const key = artistId;

    // If the key doesn't exist in the groupedData object, create an entry
    if (!groupedData[key]) {
      groupedData[key] = {
        artistId,
        candName,
        email,
        phoneNo,
        commission: 0, // Initialize commission to 0
        data: [],
      };
    }

    // Add the commission to the total commission for the artist
    groupedData[key].commission += commission;
    const entryWithCommission = { ...rest, commission };
    // Add the data to the corresponding group
    groupedData[key].data.push(entryWithCommission);
  });

  // Convert the groupedData object values to an array
  return Object.values(groupedData);
}

userService.generateOutput = (role,userData,history)=>{
  // Create a mapping of userData based on _id
  const userDataMap = new Map(userData.map(user => [String(user._id), user]));

  let output = history.map(entry => {
    let newData;
    if(role == 'user'){
      newData = userDataMap.get(entry.artistId);
    }
    else if(role == 'artist'){
      newData = userDataMap.get(entry.userId);
    }
    else{
      newData = userDataMap.get(entry.artistId);
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

userService.updateEvent=(updatePayload,userData)=>{
  return userDB.updateEvent(updatePayload,userData.role).then((data)=>{
    if(data){
      if(data.status == 200 && updatePayload.type != 'Personal Wishes' && updatePayload.type != 'Inauguration'){
        let payload = {...updatePayload,...userData}
        let roles = ['artist','user'];
        let slotMap = {
          1: '04:00 A.M - 09:00 A.M',
          2: '09:00 A.M - 02:00 P.M',
          3: '02:00 P.M - 07:00 P.M',
          4: '07:00 P.M - 12:00 A.M',
          5: '12:00 A.M - 04:00 A.M'
        }
        if(payload.type == 'hourly'){
          payload.from = userService.formatDate(payload.from);
          payload.to = userService.formatDate(payload.to);
        }
        else if(payload.type == 'event'){
          payload.slot = slotMap[payload.slot]
        }
        for(let j of roles){
          payload.role = j;
          let payload1 = {
            "subject" : '',
            "email" : '',
            "body" : ''
            }
            if(updatePayload.status == 'a'){
              payload1.subject = 'Event Accepted'
            }
            else if(updatePayload.status == 'r'){
              payload1.subject = 'Event Rejected'
            }
            else if(updatePayload.status == 'c'){
              payload1.subject = 'Event Completed'
            }
            else if(updatePayload.status == 'artist not attended'){
              payload1.subject = 'Artist Not Attended Event'
            }
            else if(updatePayload.status == 'cancelled'){
              payload1.subject = 'Event Cancelled'
            }
            let text;
            if(updatePayload.status == 'a' || updatePayload.status == 'r'){
              if(userData.role == 'artist'){
                text = `${payload1.subject} by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `${payload1.subject} by the ${userData.role} ${userData.candName}`
              }
            }
            else if(updatePayload.status == 'c'){
              if(userData.role == 'artist'){
                text = `Event status marked as Completed by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `Event status marked as Completed by the ${userData.role} ${userData.candName}`
              }
            }
            else if(updatePayload.status == 'artist not attended'){
              if(userData.role == 'artist'){
                text = `Event status marked as Artist Not Attended by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `Event status marked as Artist Not Attended by the ${userData.role} ${userData.candName}`
              }
            }
            else if(updatePayload.status == 'cancelled'){
              if(userData.role == 'artist'){
                text = `Event status marked as Cancelled by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `Event status marked as Cancelled by the ${userData.role} ${userData.candName}`
              }
            }
            if(payload.type == 'hourly'){
              payload.body = `${text} for an hourly Event on ${new Date(payload.date).toDateString()}. `
            }
            else if(payload.type == 'fullDay'){
              payload.body = `${text} for an Full Day Event on ${new Date(payload.date).toDateString()}. `
            }
            else if(payload.type == 'event'){
              payload.body = `${text} for the Event on ${new Date(payload.date).toDateString()}. `
            }
            if(j == 'user'){
              payload1.email = payload.candEmail;
            }
            else{
              payload1.email = payload.artistEmail;
            }
            let templatePath = 'templates/reminder.html';
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
      else if(data.status == 200 && updatePayload.type == 'Personal Wishes'){
        let payload = {...updatePayload,...userData}
        let roles = ['artist','user'];
        for(let j of roles){
          let payload1 = {
            "subject" : '',
            "email" : '',
            "body" : ''
            }
            let data1 = {
              "button" : false,
              "name" : '',
              "body" : ''
            }
            if(updatePayload.status == 'a'){
              payload1.subject = 'Personal Wishes Event Accepted'
            }
            else if(updatePayload.status == 'r'){
              payload1.subject = 'Personal Wishes Event Rejected'
            }
            else if(updatePayload.status == 'c'){
              payload1.subject = 'Personal Wishes Event Completed'
            }
            else if(updatePayload.status == 'artist not attended'){
              payload1.subject = `Artist didn't gave video`
            }
            else if(updatePayload.status == 'cancelled'){
              payload1.subject = 'Personal Wishes Event Cancelled'
            }
            let text;
            if(updatePayload.status == 'a' || updatePayload.status == 'r'){
              if(userData.role == 'artist'){
                text = `${payload1.subject} by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `${payload1.subject} by the ${userData.role} ${userData.candName}`
              }
            }
            else if(updatePayload.status == 'c'){
              if(userData.role == 'artist'){
                text = `Personal Wishes Event status marked as Completed by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `Personal Wishes Event status marked as Completed by the ${userData.role} ${userData.candName}`
              }
            }
            else if(updatePayload.status == 'artist not attended'){
              if(userData.role == 'artist'){
                text = `Personal Wishes Event status marked as Artist Not Attended by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `Personal Wishes Event status marked as Artist Not Attended by the ${userData.role} ${userData.candName}`
              }
            }
            else if(updatePayload.status == 'cancelled'){
              if(userData.role == 'artist'){
                text = `Personal Wishes Event status marked as Cancelled by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `Personal Wishes Event status marked as Cancelled by the ${userData.role} ${userData.candName}`
              }
            }
            data1.body = `${text} with a deadline date : ${new Date(payload.date).toDateString()}. `
            if(j == 'user'){
              payload1.email = payload.candEmail;
              data1.name = payload.candName;
            }
            else{
              payload1.email = payload.artistEmail;
              data1.name = payload.artistName;
            }
            let templatePath = 'templates/welcome.html';
            ejs.renderFile(templatePath,data1,(err,html)=>{
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
      else if(data.status == 200 && updatePayload.type == 'Inauguration'){
        let payload = {...updatePayload,...userData}
        let roles = ['artist','user'];
        for(let j of roles){
          let payload1 = {
            "subject" : '',
            "email" : '',
            "body" : ''
            }
            let data1 = {
              "button" : false,
              "name" : '',
              "body" : ''
            }
            if(updatePayload.status == 'a'){
              payload1.subject = 'Inauguration Event Accepted'
            }
            else if(updatePayload.status == 'r'){
              payload1.subject = 'Inauguration Event Rejected'
            }
            else if(updatePayload.status == 'c'){
              payload1.subject = 'Inauguration Event Completed'
            }
            else if(updatePayload.status == 'artist not attended'){
              payload1.subject = `Artist Not Attended`
            }
            else if(updatePayload.status == 'cancelled'){
              payload1.subject = 'Inauguration Event Cancelled'
            }
            let text;
            if(updatePayload.status == 'a' || updatePayload.status == 'r'){
              if(userData.role == 'artist'){
                text = `${payload1.subject} by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `${payload1.subject} by the ${userData.role} ${userData.candName}`
              }
            }
            else if(updatePayload.status == 'c'){
              if(userData.role == 'artist'){
                text = `Inauguration Event status marked as Completed by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `Inauguration Event status marked as Completed by the ${userData.role} ${userData.candName}`
              }
            }
            else if(updatePayload.status == 'artist not attended'){
              if(userData.role == 'artist'){
                text = `Inauguration Event status marked as Artist Not Attended by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `Inauguration Event status marked as Artist Not Attended by the ${userData.role} ${userData.candName}`
              }
            }
            else if(updatePayload.status == 'cancelled'){
              if(userData.role == 'artist'){
                text = `Inauguration Event status marked as Cancelled by the ${userData.role} ${userData.artistName}`
              }
              else{
                text = `Inauguration Event status marked as Cancelled by the ${userData.role} ${userData.candName}`
              }
            }
            data1.body = `${text} with a deadline date : ${new Date(payload.date).toDateString()}. `
            if(j == 'user'){
              payload1.email = payload.candEmail;
              data1.name = payload.candName;
            }
            else{
              payload1.email = payload.artistEmail;
              data1.name = payload.artistName;
            }
            let templatePath = 'templates/welcome.html';
            ejs.renderFile(templatePath,data1,(err,html)=>{
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
        data: 'Unable to update now'
      }
      return res
    }
  })
}

userService.updatePay=(payload)=>{
  return userDB.updatePay(payload).then((data)=>{
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
  let role = payload.role
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
    return userDB.updateBooking(payload).then(async(data)=>{
      if(data){
        let dataPayload = {
          userId : payload.data.userId,
          artistId : payload.data.artistId
        }
        let userData = await userDB.fetchUserAndArtist(dataPayload);
        if(userData){
        payload = {...payload.data,...userData};
        let roles = ['artist','user'];
        let slotMap = {
          1: '04:00 A.M - 09:00 A.M',
          2: '09:00 A.M - 02:00 P.M',
          3: '02:00 P.M - 07:00 P.M',
          4: '07:00 P.M - 12:00 A.M',
          5: '12:00 A.M - 04:00 A.M'
        }
        if(payload.type == 'hourly'){
          payload.from = userService.formatDate(payload.from);
          payload.to = userService.formatDate(payload.to);
        }
        else if(payload.type == 'event'){
          payload.slot = slotMap[payload.slot]
        }
        for(let j of roles){
          payload.role = j;
          let payload1 = {
            "subject" : 'Mark Your Calendar: Event Rescheduled Successfully!',
            "email" : '',
            "body" : ""
            }
            if(payload.type == 'hourly'){
              payload.body = `Successfully rescheduled hourly Event to ${new Date(payload.date).toDateString()}. `
            }
            else if(payload.type == 'fullDay'){
              payload.body = `Successfully rescheduled Full Day Event to ${new Date(payload.date).toDateString()}. `
            }
            else if(payload.type == 'event'){
              payload.body = `Successfully rescheduled Event to ${new Date(payload.date).toDateString()}. `
            }
            if(j == 'user'){
              payload1.email = payload.candEmail;
              payload.body = payload.body+`You have hired ${payload.artistName} as ${payload.name}.`
            }
            else{
              payload1.email = payload.artistEmail;
              payload.body = payload.body+`You have been hired by ${payload.candName} as ${payload.name}.`
            }
            if(role == 'user'){
              payload.body = payload.body + ` Rescheduled by ${payload.candName}.`
            }
            else{
              payload.body = payload.body + ` Rescheduled by ${payload.artistName}.`
            }
            let templatePath = 'templates/reminder.html';
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
        return data
        }
        else{
          let res= {
            status : 200,
            data: 'Booking Successful but unable to send confirmation email'
          }
          return res
        }
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
        console.log(data)
        let role = ['user','artist']
        for(let i of data){
          let slotMap = {
            1: '04:00 A.M - 09:00 A.M',
            2: '09:00 A.M - 02:00 P.M',
            3: '02:00 P.M - 07:00 P.M',
            4: '07:00 P.M - 12:00 A.M',
            5: '12:00 A.M - 04:00 A.M'
          }
          if(i.type == 'hourly'){
            i.from = userService.formatDate(i.from);
            i.to = userService.formatDate(i.to);
          }
          else if(i.type == 'event'){
            i.slot = slotMap[i.slot]
          }
          for(let j of role){
            let payload = {
              "subject":"",
              "email":"",
              "body":"",
              "attachment":""
            }
            i.role = j;
            if(new Date().toDateString() == new Date(i.date).toDateString()){
              if(i.type == 'hourly'){
                payload.subject = 'Reminder: Hourly Event Today'
                i.body = `This is a gentle reminder for the today's hourly event. `
              }
              else if(i.type == 'fullDay'){
                payload.subject = 'Reminder: Full Day Event Today';
                i.body = `This is a gentle reminder for the today's Full Day event. `
              }
              else if(i.type == 'event'){
                payload.subject = 'Reminder: Event Today'
                i.body = `This is a gentle reminder for the today's Event. `
              }
            }
            else{
              if(i.type == 'hourly'){
                payload.subject = `Reminder: Hourly Event on ${new Date(i.date).toDateString()}`;
                i.body = `This is a gentle reminder for the hourly Event on ${new Date(i.date).toDateString()}. `
              }
              else if(i.type == 'fullDay'){
                payload.subject = `Reminder: Full Day Event on ${new Date(i.date).toDateString()}`
                i.body = `This is a gentle reminder for the Full Day Event on ${new Date(i.date).toDateString()}. `
              }
              else if(i.type == 'event'){
                payload.subject = `Reminder: Event on ${new Date(i.date).toDateString()}`
                i.body = `This is a gentle reminder for the Event on ${new Date(i.date).toDateString()}. `
              }
            }
            if(j == 'user'){
              payload.email = i.candEmail;
              i.body = i.body+`You have hired ${i.artistName} as ${i.name}.`
            }
            else{
              payload.email = i.artistEmail;
              i.body = i.body+`You have been hired by ${i.candName} as ${i.name}.`
            }
            let templatePath = 'templates/reminder.html';
            ejs.renderFile(templatePath,i,(err,html)=>{
              if(err){
                console.log(err)
              }
              else{
                payload.body = html;
                console.log(i)
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

userService.formatDate = (input) => {
  input = new Date(input)
  // Get day, month, year
  let day = input.toLocaleString('en-US', { weekday: 'short' });
  let month = input.toLocaleString('en-US', { month: 'short' });
  let date = input.getDate();
  let year = input.getFullYear();

  // Get hours, minutes, and AM/PM
  let hours = input.getHours() % 12 || 12; // Convert to 12-hour format
  let minutes = input.getMinutes();
  let amPm = input.getHours() >= 12 ? 'P.M' : 'A.M';

  // Format the output string
  return `${day} ${month} ${date} ${year} ${hours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
}

userService.fetchArtistDashboardData=(payload)=>{
  return userDB.fetchArtistDashboardData(payload).then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch dashboard data now'
      }
      return res
    }
  })
}

userService.fetchUserDashboardData=(payload)=>{
  return userDB.fetchUserDashboardData(payload).then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch dashboard data now'
      }
      return res
    }
  })
}

userService.payArtCommission=(payload,userData)=>{
  return userDB.payArtCommission(payload,userData).then(async(data)=>{
    if(data){
      if(data.status == 200){
        let ccEmails = await userDB.fetchAdminEmails();
        if(ccEmails){
          let payload1;
          let mailPayload;
          if(userData.role == 'admin'){
            payload1 = {
              "subject" : 'Commission Payment Success',
              "email" : ccEmails,
              "body" : '',
              "cc":payload.email
            }         
            mailPayload = {
              "button" : false,
              "name" : false,
              "body" : `This is to inform you that the commission of rupees ${payload.commission} was paid by the team Artlist to artist ${payload.name}.`,
            }
          }
          else if(userData.role == 'artist'){
            payload1 = {
              "subject" : 'Commission Payment Success',
              "email" : userData.email,
              "body" : '',
              "cc":ccEmails
            }
            mailPayload = {
              "button" : false,
              "name" : false,
              "body" : `This is to inform you that the commission of rupees ${payload.commission} was paid by the artist ${userData.name} to team Artlist.`,
            }
          }
          let templatePath = 'templates/welcome.html';
          ejs.renderFile(templatePath,mailPayload,(err,html)=>{
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
      return data;
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

userService.fetchBalance=(payload,role)=>{
  return userDB.fetchBalance(payload,role).then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch balance'
      }
      return res
    }
  })
}

userService.withdrawBalance=(amount,payload)=>{
  return userDB.withdrawBalance(amount,payload).then(async(data)=>{
    if(data){
      if(data.status == 200){
        let adminMails = await userDB.fetchAdminEmails();
        let payload1 = {
          "subject" : 'Amount Withdrawn',
          "email" : payload.email,
          "body" : ""
          }
          let data1 = {
            "button" : false,
            "name" : payload.name,
            "body" : `You have withdrawn an amount of rupees ${amount}, and the request is currently in progress and you will get notified once completed. If this was not you report immediately to ${adminMails[0]}`,
          }
          let templatePath = 'templates/welcome.html';
          ejs.renderFile(templatePath,data1,(err,html)=>{
            if(err){
              console.log(err)
            }
            else{
              payload1.body = html;
              userService.sendMail(payload1)
            }
          })
          let payload2 = {
            "subject" : 'Amount Withdrawn',
            "email" : adminMails,
            "body" : ""
          }
          let data2 = {
            "button" : false,
            "name" : false,
            "body" : `This is to notify you that ${payload.role} ${payload.name} has withdrawn an amount of rupees ${amount}. Please login to Artlist and settle pending amounts.`,
          }
          ejs.renderFile(templatePath,data2,(err,html)=>{
            if(err){
              console.log(err)
            }
            else{
              payload2.body = html;
              userService.sendMail(payload2)
            }
          })
      }
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to update balance'
      }
      return res
    }
  })
}

userService.fetchAllRefunds=()=>{
  return userDB.fetchAllRefunds().then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch refund requests'
      }
      return res
    }
  })
}

userService.requestRefund=(payload)=>{
  return userDB.requestRefund(payload).then(async(data)=>{
    if(data){
      if(data.status == 200){
        let adminMails = await userDB.fetchAdminEmails();
        adminMails.push(payload.artistEmail)
        let payload1 = {
          "subject" : 'Refund Requested',
          "email" : adminMails,
          'cc': payload.candEmail,
          "body" : ""
          }
          let slotMap = {
            1: '04:00 A.M - 09:00 A.M',
            2: '09:00 A.M - 02:00 P.M',
            3: '02:00 P.M - 07:00 P.M',
            4: '07:00 P.M - 12:00 A.M',
            5: '12:00 A.M - 04:00 A.M'
          }
          if(payload.type == 'hourly'){
            payload.from = userService.formatDate(payload.from);
            payload.to = userService.formatDate(payload.to);
          }
          else if(payload.type == 'event'){
            payload.slot = slotMap[payload.slot]
          }
          payload.body = `This is to inform you that ${payload.candName} has requested refund for the event completed on ${new Date(payload.date).toDateString()}. Refund Reason : ${payload.refundReason}. Event Price : ${payload.price} ₹`
          let templatePath = 'templates/reminder.html';
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
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to request refund'
      }
      return res
    }
  })
}

userService.payRefund=async(payload)=>{
  if(payload.refundAccepted1 == true){
    let commissionData = await userDB.getcommissionStatus(payload._id);
    if(commissionData.paid && commissionData.commissionPaid == 'Not Paid'){
      return userDB.payRefundWithoutCommission(payload,commissionData).then(async(data)=>{
        if(data){
          if(data.status == 200){
            let adminMails = await userDB.fetchAdminEmails();
            let payload1 = {
              "subject" : 'Refund Accepted',
              "email" : payload.candEmail,
              "cc" : adminMails,
              "body" : ""
              }
              let data1 = {
                "button" : false,
                "name" : payload.candName,
                "body" : `This is to inform you that the team Artlist has settled an amount of rupees ${payload.price}, for the event you hired ${payload.artistName} as ${payload.name}. The amount will be added to your wallet.`
              }
              let templatePath = 'templates/welcome.html';
              ejs.renderFile(templatePath,data1,(err,html)=>{
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
          let res= {
            status : 204,
            data: 'Unable to pay refund'
          }
          return res
        }
      })
    }
    else if(commissionData.paid && commissionData.commissionPaid == 'Paid'){
      return userDB.payRefundWithCommission(payload,commissionData).then(async(data)=>{
        if(data){
          if(data.status == 200){
            let adminMails = await userDB.fetchAdminEmails();
            let payload1 = {
              "subject" : 'Refund Accepted',
              "email" : payload.candEmail,
              "cc" : adminMails,
              "body" : ""
              }
              let data1 = {
                "button" : false,
                "name" : payload.candName,
                "body" : `This is to inform you that the team Artlist has settled an amount of rupees ${payload.price}, for the event you hired ${payload.artistName} as ${payload.name}. The amount will be added to your wallet.`
              }
              let templatePath = 'templates/welcome.html';
              ejs.renderFile(templatePath,data1,(err,html)=>{
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
          let res= {
            status : 204,
            data: 'Unable to pay refund'
          }
          return res
        }
      })
    }
    else{
      return {status:204,data:'Not eligible for refund'}
    }
  }
  else{
    let data = await userDB.rejectRefund(payload._id);
    if(data){
      if(data.status == 200){
        let adminMails = await userDB.fetchAdminEmails();
        let payload1 = {
          "subject" : 'Refund Rejected',
          "email" : payload.candEmail,
          "cc" : adminMails,
          "body" : ""
          }
          let data1 = {
            "button" : false,
            "name" : payload.candName,
            "body" : `This is to inform you that the team Artlist has rejected refund request with an amount of rupees ${payload.price}, for the event you hired ${payload.artistName} as ${payload.name}`
          }
          let templatePath = 'templates/welcome.html';
          ejs.renderFile(templatePath,data1,(err,html)=>{
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
      let res= {
        status : 204,
        data: 'Unable to reject refund request'
      }
      return res
    }
  }
}

userService.fetchWithdraws=(payload,role)=>{
  return userDB.fetchWithdraws(payload,role).then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to Withdraw requests'
      }
      return res
    }
  })
}

userService.fetchWalletWithdraws=(payload,role)=>{
  return userDB.fetchWalletWithdraws(payload,role).then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch wallet history'
      }
      return res
    }
  })
}

userService.fetchPendingWithdraws=()=>{
  return userDB.fetchPendingWithdraws().then((data)=>{
    if(data){
      return data
    }
    else{
      let res= {
        status : 204,
        data: 'Unable to fetch pending withdraw requests'
      }
      return res
    }
  })
}

userService.payBalance=(payload)=>{
  return userDB.payBalance(payload).then(async(data)=>{
    if(data){
      if(data.status == 200){
        let adminMails = await userDB.fetchAdminEmails();
        let payload1 = {
          "subject" : 'Amount Settled',
          "email" : payload.email,
          "body" : "",
          "cc":adminMails
          }
          let data1 = {
            "button" : false,
            "name" : payload.name,
            "body" : `This is to inform you that an amount of rupees ${payload.amount} which you have withdrawn was settled by the team Artlist.`,
          }
          let templatePath = 'templates/welcome.html';
          ejs.renderFile(templatePath,data1,(err,html)=>{
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
      let res= {
        status : 204,
        data: 'Unable to update'
      }
      return res
    }
  })
}

userService.bookWishes=(payload)=>{
  return userDB.bookWishes(payload).then(async(data)=>{
    if(data){
      if(data.status == 200){
        let roles = ['artist','user'];
        for(let j of roles){
          let payload1 = {
            "subject" : 'Personal Wishes Booking Successful',
            "email" : '',
            "body" : "",
            }
            let data1 = {
              "button" : false,
              "name" : '',
              "body" : '',
            }
            if(j == 'user'){
              payload1.email = payload.userEmail;
              data1.name = payload.userName
              data1.body = `This is to inform you that you have successfully hired ${payload.artistName} for Personal Wishes. The artist will give you the personalised video before ${new Date(payload.date).toDateString()}. Artist Phone No : ${payload.artistPhone}, Artist Email : ${payload.artistEmail}.`
            }
            else{
              payload1.email = payload.artistEmail;
              data1.name = payload.artistName
              data1.body = `This is to inform you that you have been hired by ${payload.userName} for Personal Wishes. You should give the personalised video before ${new Date(payload.date).toDateString()}. User Phone No : ${payload.userPhone}, User Email : ${payload.userEmail}.`
            }
            let templatePath = 'templates/welcome.html';
            ejs.renderFile(templatePath,data1,(err,html)=>{
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
        data: 'Unable to update'
      }
      return res
    }
  })
}

userService.bookInaug=async(payload)=>{
  let available= await userDB.fetchAvailable(payload.artistId);
  let availableData;
  if(available.status == 200){
    availableData = available.data;
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
    return userDB.bookInaug(payload).then(async(data)=>{
      if(data){
        if(data.status == 200){
          let roles = ['artist','user'];
          let slotMap = {
            1: '04:00 A.M - 09:00 A.M',
            2: '09:00 A.M - 02:00 P.M',
            3: '02:00 P.M - 07:00 P.M',
            4: '07:00 P.M - 12:00 A.M',
            5: '12:00 A.M - 04:00 A.M'
          }
          payload.slot = slotMap[payload.slot]
          for(let j of roles){
            payload.role = j;
            payload.type = 'event'
            let payload1 = {
              "subject" : 'Locked and Loaded: Your Event Booking Confirmation',
              "email" : '',
              "body" : ""
            }
            payload.body = `Booking successful for Event on ${new Date(payload.date).toDateString()}. `
            if(j == 'user'){
              payload1.email = payload.candEmail;
              payload.body = payload.body+`You have hired ${payload.artistName} for Inauguration.`
            }
            else{
              payload1.email = payload.artistEmail;
              payload.body = payload.body+`You have been hired by ${payload.candName} for Inauguration.`
            }
            let templatePath = 'templates/reminder.html';
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

userService.sendPayMail = async(payload) =>{
  let payload1 = {
    "subject" : `Amount Paid`,
    "email" : payload.email,
    "body" : '',
    "attachment" : ""
  }
  let data = {
    "button": false,
    "name": payload.name,
    "url": false,
    "body": `You made a payment of rupees ${payload.price/100} to Artlist with Payment Id : ${payload.paymentId}. Keep this payment id for future reference.`,
  }
  let templatePath = 'templates/welcome.html';
  ejs.renderFile(templatePath, data, (err, html) => {
    if (err) {
      console.log(err)
    }
    else {
      payload1.body = html;
      userService.sendMail(payload1)
    }
  })
  let res = {
    status: 200,
    data: "mail sent"
  }
  return res
}

userService.updatePayment=(payload)=>{
  return userDB.updatePayment(payload).then((data)=>{
    if(data){
      userService.sendPayMail(payload)
      return true
    }
    else{
      return false;
    }
  })
}

userService.updateReschedulePayment=(payload)=>{
  return userDB.updateReschedulePayment(payload).then((data)=>{
    if(data){
      userService.sendPayMail(payload)
      return true
    }
    else{
      return false;
    }
  })
}

userService.test=()=>{
  return userDB.test().then((data)=>{
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

module.exports = userService