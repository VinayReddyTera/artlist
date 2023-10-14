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
                                color:black;'>You have successfully registered as ${data.role} for Artlist</p>
                      
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
                            You can <a href=${origin}/account/reset-password/${token} target='_blank'>Click Here</a> to continue further
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

module.exports = userService