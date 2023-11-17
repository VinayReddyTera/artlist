const userDB = require('../model/users');
const nodemailer = require('nodemailer');
const userService = {}
const jwt = require('jsonwebtoken');

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
                          "body" : ` <table align='center' border='0' cellpadding='0' cellspacing='0' width='550' bgcolor='white'
                          style='border:2px solid black;border-radius:5px;'>
                          <tbody>
                            <tr>
                              <td align='center'>
                                <table align='center' border='0' cellpadding='0' cellspacing='0' class='col-550' width='550'>
                                  <tbody>
                                    <tr>
                                      <td align='center' style='background-color: #d5dafa;
                                                          height: 50px;'>
                        
                                        <a href='#' style='text-decoration: none;'>
                                          <p style='color:#556ee6;
                                                                  font-weight:bold;'>
                                            Artlist
                                          </p>
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr style='height: 300px;'>
                              <td align='center' style='border: none;
                                          border-bottom: 2px solid #d5dafa; 
                                          padding-right: 20px;padding-left:20px'>
                        
                                <p style='font-size: 24px;
                                              color:black;'>
                                  Hello ${data.name}
                                </p>
                                <p style='font-size: 24px;
                                color:black;'>You have successfully registered as an ${role} for Artlist</p>
                      
                              </td>
                            </tr>
                            <tr>
                              <td style='
                          font-size:11px; line-height:18px; 
                          color:#999999;' valign='top' align='center'>
                                <a href='#' style='color:#999999; 
                          text-decoration:underline;'>PRIVACY STATEMENT</a>
                                | <a href='#' style='color:#999999; text-decoration:underline;'>TERMS OF SERVICE</a>
                                | <a href='#' style='color:#999999; text-decoration:underline;'>RETURNS</a><br>
                                © 2023 Artlist. All Rights Reserved.<br>
                                If you do not wish to receive any further
                                emails from us, please
                                <a href='#' style='text-decoration:none; 
                                        color:#999999;'>unsubscribe</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        </td>
                        </tr>
                        </tbody>
                        </table>`,
                          "attachment" : ""
                      }
                  }
                  else{
                      payload1 = {
                          "subject" : `Artlist Registration Status`,
                          "email" : data.email,
                          "body" : ` <table align='center' border='0' cellpadding='0' cellspacing='0' width='550' bgcolor='white'
                          style='border:2px solid black;border-radius:5px;'>
                          <tbody>
                            <tr>
                              <td align='center'>
                                <table align='center' border='0' cellpadding='0' cellspacing='0' class='col-550' width='550'>
                                  <tbody>
                                    <tr>
                                      <td align='center' style='background-color: #d5dafa;
                                                          height: 50px;'>
                        
                                        <a href='#' style='text-decoration: none;'>
                                          <p style='color:#556ee6;
                                                                  font-weight:bold;'>
                                            Artlist
                                          </p>
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr style='height: 300px;'>
                              <td align='center' style='border: none;
                                          border-bottom: 2px solid #d5dafa; 
                                          padding-right: 20px;padding-left:20px'>
                        
                                <p style='font-size: 24px;
                                              color:black;'>
                                  Hello ${data.name}
                                </p>
                                <p style='font-size: 24px;
                                color:black;'>You registration Status is : ${isCreated.data}</p>
                      
                              </td>
                            </tr>
                            <tr>
                              <td style='
                          font-size:11px; line-height:18px; 
                          color:#999999;' valign='top' align='center'>
                                <a href='#' style='color:#999999; 
                          text-decoration:underline;'>PRIVACY STATEMENT</a>
                                | <a href='#' style='color:#999999; text-decoration:underline;'>TERMS OF SERVICE</a>
                                | <a href='#' style='color:#999999; text-decoration:underline;'>RETURNS</a><br>
                                © 2023 Artlist. All Rights Reserved.<br>
                                If you do not wish to receive any further
                                emails from us, please
                                <a href='#' style='text-decoration:none; 
                                        color:#999999;'>unsubscribe</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        </td>
                        </tr>
                        </tbody>
                        </table>`,
                          "attachment" : ""
                      }
                  }
                  userService.sendMail(payload1)
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
                    "body" : ` <table align='center' border='0' cellpadding='0' cellspacing='0' width='550' bgcolor='white'
                    style='border:2px solid black;border-radius:5px;'>
                    <tbody>
                        <tr>
                        <td align='center'>
                            <table align='center' border='0' cellpadding='0' cellspacing='0' class='col-550' width='550'>
                            <tbody>
                                <tr>
                                <td align='center' style='background-color: #d5dafa;
                                                    height: 50px;'>
                    
                                    <a href='#' style='text-decoration: none;'>
                                    <p style='color:#556ee6;
                                                            font-weight:bold;'>
                                        Artlist
                                    </p>
                                    </a>
                                </td>
                                </tr>
                            </tbody>
                            </table>
                        </td>
                        </tr>
                        <tr style='height: 300px;'>
                        <td align='center' style='border: none;
                                    border-bottom: 2px solid #d5dafa; 
                                    padding-right: 20px;padding-left:20px'>
                            <p style='font-size: 24px;
                            color:black;'>
                            Click below link to reset your password. The below link expires in 2 hours<br>
                            <a href=${origin}/account/reset-password/${token} target='_blank'><button style="display: inline-block;
                            font-weight: 400;
                            text-align: center;
                            white-space: nowrap;
                            vertical-align: middle;
                            -webkit-user-select: none;
                            -moz-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            border: 1px solid transparent;
                            padding: 0.375rem 0.75rem;
                            font-size: 1rem;
                            line-height: 1.5;
                            background-color : #234c87;
                            color : #fff;
                            border-radius: 0.25rem;
                            cursor:pointer;
                            transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;">
                            Click Here!
                            </button></a>
                </p>
                
                        </td>
                        </tr>
                        <tr>
                        <td style='
                    font-size:11px; line-height:18px; 
                    color:#999999;' valign='top' align='center'>
                            <a href='#' style='color:#999999; 
                    text-decoration:underline;'>PRIVACY STATEMENT</a>
                            | <a href='#' style='color:#999999; text-decoration:underline;'>TERMS OF SERVICE</a>
                            | <a href='#' style='color:#999999; text-decoration:underline;'>RETURNS</a><br>
                            © 2023 Artlist. All Rights Reserved.<br>
                            If you do not wish to receive any further
                            emails from us, please
                            <a href='#' style='text-decoration:none; 
                                    color:#999999;'>unsubscribe</a>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                    </td>
                    </tr>
                    </tbody>
                    </table>`
                }
                userService.sendMail(payload1)
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
    "body" : ` <table align='center' border='0' cellpadding='0' cellspacing='0' width='550' bgcolor='white'
    style='border:2px solid black;border-radius:5px;'>
    <tbody>
        <tr>
        <td align='center'>
            <table align='center' border='0' cellpadding='0' cellspacing='0' class='col-550' width='550'>
            <tbody>
                <tr>
                <td align='center' style='background-color: #d5dafa;
                                    height: 50px;'>
    
                    <a href='#' style='text-decoration: none;'>
                    <p style='color:#556ee6;
                                            font-weight:bold;'>
                        Artlist
                    </p>
                    </a>
                </td>
                </tr>
            </tbody>
            </table>
        </td>
        </tr>
        <tr style='height: 300px;'>
        <td align='center' style='border: none;
                    border-bottom: 2px solid #d5dafa; 
                    padding-right: 20px;padding-left:20px'>
            <p style='font-size: 24px;
            color:black;'>
            Click below link verify email. The below link expires in 2 hours<br>
            <a href=${protocol}://${host}/verifyEmail/${token} target='_blank'><button style="display: inline-block;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            border: 1px solid transparent;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            background-color : #234c87;
            color : #fff;
            border-radius: 0.25rem;
            cursor:pointer;
            transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;">
            Click Here!
            </button></a>
</p>
        </td>
        </tr>
        <tr>
        <td style='
    font-size:11px; line-height:18px; 
    color:#999999;' valign='top' align='center'>
            <a href='#' style='color:#999999; 
    text-decoration:underline;'>PRIVACY STATEMENT</a>
            | <a href='#' style='color:#999999; text-decoration:underline;'>TERMS OF SERVICE</a>
            | <a href='#' style='color:#999999; text-decoration:underline;'>RETURNS</a><br>
            © 2023 Artlist. All Rights Reserved.<br>
            If you do not wish to receive any further
            emails from us, please
            <a href='#' style='text-decoration:none; 
                    color:#999999;'>unsubscribe</a>
        </td>
        </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>`
    }
    userService.sendMail(payload1)
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
                  "body" : ` <table align='center' border='0' cellpadding='0' cellspacing='0' width='550' bgcolor='white'
                  style='border:2px solid black;border-radius:5px;'>
                  <tbody>
                    <tr>
                      <td align='center'>
                        <table align='center' border='0' cellpadding='0' cellspacing='0' class='col-550' width='550'>
                          <tbody>
                            <tr>
                              <td align='center' style='background-color: #d5dafa;
                                                  height: 50px;'>
                
                                <a href='#' style='text-decoration: none;'>
                                  <p style='color:#556ee6;
                                                          font-weight:bold;'>
                                    Artlist
                                  </p>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr style='height: 300px;'>
                      <td align='center' style='border: none;
                                  border-bottom: 2px solid #d5dafa; 
                                  padding-right: 20px;padding-left:20px'>
                
                        <p style='font-size: 24px;
                                      color:black;'>
                          Hello ${payload.name}
                        </p>
                        <p style='font-size: 24px;
                        color:black;'>You have successfully registered as an Approver for Artlist</p>
              
                      </td>
                    </tr>
                    <tr>
                      <td style='
                  font-size:11px; line-height:18px; 
                  color:#999999;' valign='top' align='center'>
                        <a href='#' style='color:#999999; 
                  text-decoration:underline;'>PRIVACY STATEMENT</a>
                        | <a href='#' style='color:#999999; text-decoration:underline;'>TERMS OF SERVICE</a>
                        | <a href='#' style='color:#999999; text-decoration:underline;'>RETURNS</a><br>
                        © 2023 Artlist. All Rights Reserved.<br>
                        If you do not wish to receive any further
                        emails from us, please
                        <a href='#' style='text-decoration:none; 
                                color:#999999;'>unsubscribe</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>`,
                  "attachment" : ""
              }
          }
          userService.sendMail(payload1)
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

userService.bookArtist=(payload)=>{
  return userDB.bookArtist(payload).then((data)=>{
    if(data){
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
        let res= {
          status : 204,
          data: 'Unable to fetch history'
        }
        return res
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

userService.updateBooking=(payload)=>{
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

module.exports = userService