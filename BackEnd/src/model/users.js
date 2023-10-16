const connection = require("../utilities/connection");
const ObjectId = require('mongodb').ObjectId; 
const userDB = {}
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

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
        status : data.profileStatus,
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
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(userData.password, salt);
    const collection = await connection.getArtist();
    const data = await collection.updateOne({ "email" : userData.email},{"$set": {"password" : hashpassword}});
    if (data.modifiedCount == 1 && data.acknowledged == true) {
        let res = {
            status :200,
            data : "Successfully updated password"
        }
        return res
    }
    else{
        return false
    }
  }
  else if(userData.role == 'user'){
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(userData.password, salt);
    const collection = await connection.getUsers();
    const data = await collection.updateOne({ "email" : userData.email},{"$set": {"password" : hashpassword}});
    if (data.modifiedCount == 1 && data.acknowledged == true) {
        let res = {
            status :200,
            data : "Successfully updated password"
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

userDB.updateProfile = async (userData) => {
  if(userData.role == 'artist'){
    const collection = await connection.getArtist();
    const data = await collection.updateOne({ "id" : new ObjectId(userData.id)},{"$set": {"name" : userData.name, "email":userData.email, "phoneNo":userData.phoneNo,"profileStatus":userData.profileStatus}});
    if (data.modifiedCount == 1 && data.acknowledged == true) {
        let res = {
            status :200,
            data : "Successfully updated profile"
        }
        return res
    }
    else{
        return false
    }
  }
  else if(userData.role == 'user'){
    const collection = await connection.getUsers();
    const data = await collection.updateOne({ "_id" : new ObjectId(userData.id)},{"$set": {"name" : userData.name, "email":userData.email, "phoneNo":userData.phoneNo,"profileStatus":userData.profileStatus}});
    if (data.modifiedCount == 1 && data.acknowledged == true) {
        let res = {
            status :200,
            data : "Successfully updated profile"
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

module.exports = userDB