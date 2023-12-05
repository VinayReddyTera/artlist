const connection = require("../utilities/connection");
const ObjectId = require('mongodb').ObjectId; 
const userDB = {}
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

userDB.checkLoginUser = async (payload) => {
  let data;
    if(payload.role == 'user'){
      const collection = await connection.getUsers();
      data = await collection.findOne({"email" : payload.email},{_id : 0});
    }
    else if(payload.role == 'artist'){
      const collection = await connection.getArtist();
      data = await collection.findOne({"email" : payload.email},{_id : 0});
    }
    else if(payload.role == 'tag' || userData.role == 'admin'){
      const collection = await connection.getTag();
      data = await collection.findOne({"email" : payload.email},{_id : 0});
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
  let data;
  if(data1.role == 'artist'){
    const collection = await connection.getArtist();
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(data1.password, salt);
    let artistData = {
      name : data1.name,
      email : data1.email,
      password : hashpassword,
      phoneNo : data1.phoneNo,
      role: data1.role,
      language:data1.language,
      address : data1.address,
      mandal : data1.mandal,
      district:data1.district,
      state : data1.state,
      pincode : data1.pincode
    }
    data = await collection.create(artistData);
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
    const collection = await connection.getUsers();
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(data1.password, salt);
    let userData = {
      name : data1.name,
      email : data1.email,
      password : hashpassword,
      phoneNo : data1.phoneNo,
      role:data1.role
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
  else if(data1.role == 'tag'){
    const collection = await connection.getTag();
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(data1.password, salt);
    let userData = {
      name : data1.name,
      email : data1.email,
      password : hashpassword,
      phoneNo : data1.phoneNo,
      role:data1.role
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
        _id : data._id,
        emailVerified: data.emailVerified,
        phoneVerified: data.phoneVerified
      },
      add:{
        address : data.address,
        mandal : data.mandal,
        district : data.district,
        state : data.state,
        pincode : data.pincode,
        language : data.language
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
        _id : data._id,
        emailVerified: data.emailVerified,
        phoneVerified: data.phoneVerified
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
  else if(data1.role == "tag" || userData.role == 'admin'){
    const collection = await connection.getTag();
    const data = await collection.findOne({"email" : data1.email});
    if(data.status != 'active'){
      let res = {
        status : 204,
        data : 'You are not an active approver, connect with admin'
      }
      return res
    }
    if(data.password){
      const checkPassword = await bcrypt.compare(data1.password,data.password);
      if (checkPassword) {
        let userData = {
          status: 200,
          data:{
          name : data.name,
          phoneNo : data.phoneNo,
          role:data.role,
          email : data.email,
          language : data.language,
          skillName : data.skillName,
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
        data : 'Create password by clicking forgot password'
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
  else if(payload.role == 'tag' || userData.role == 'admin'){
    const collection = await connection.getTag();
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
    else if(userData.role == 'tag' || userData.role == 'admin'){
      const collection = await connection.getTag();
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
  else if(data1.role == 'tag' || userData.role == 'admin'){
    const collection = await connection.getTag();
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
  else if(userData.role == 'tag' || userData.role == 'admin'){
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(userData.password, salt);
    const collection = await connection.getTag();
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
    const data = await collection.updateOne({ "_id" : new ObjectId(userData.id)},
    {"$set": 
    {
      "name" : userData.name,
      "email":userData.email,
      "phoneNo":userData.phoneNo,
      "profileStatus":userData.profileStatus,
      "emailVerified": userData.emailVerified,
      "phoneVerified": userData.phoneVerified,
      "language" : userData.language,
      "address" : userData.address,
      "mandal" : userData.mandal,
      "district" : userData.district,
      "state" : userData.state,
      "pincode" : userData.pincode
    }
  });
    if (data.modifiedCount == 1 || data.acknowledged == true) {
        let res = {
            status :200,
            data : "Successfully updated profile",
            userData:{
              name : userData.name,
              phoneNo : userData.phoneNo,
              email : userData.email,
              role : userData.role,
              status : userData.profileStatus,
              _id : userData.id,
              emailVerified: userData.emailVerified,
              phoneVerified: userData.phoneVerified
            }
        }
        return res
    }
    else{
        return false
    }
  }
  else if(userData.role == 'user'){
    const collection = await connection.getUsers();
    const data = await collection.updateOne({ "_id" : new ObjectId(userData.id)},
    {"$set": 
    {
      "name" : userData.name,
      "email":userData.email,
      "phoneNo":userData.phoneNo,
      "profileStatus":userData.profileStatus,
      "emailVerified": userData.emailVerified,
      "phoneVerified": userData.phoneVerified
    }
  });
    if (data.modifiedCount == 1 || data.acknowledged == true) {
        let res = {
            status :200,
            data : "Successfully updated profile",
            userData:{
              name : userData.name,
              phoneNo : userData.phoneNo,
              email : userData.email,
              role : userData.role,
              status : userData.profileStatus,
              _id : userData.id,
              emailVerified: userData.emailVerified,
              phoneVerified: userData.phoneVerified
            }
        }
        return res
    }
    else{
        return false
    }
  }
  else if(userData.role == 'tag' || userData.role == 'admin'){
    const collection = await connection.getTag();
    const data = await collection.updateOne({ "_id" : new ObjectId(userData.id)},
    {"$set": 
    {
      "name" : userData.name,
      "email":userData.email,
      "phoneNo":userData.phoneNo
    }
  });
    if (data.modifiedCount == 1 || data.acknowledged == true) {
        let res = {
            status :200,
            data : "Successfully updated profile",
            userData:{
              name : userData.name,
              phoneNo : userData.phoneNo,
              email : userData.email,
              role : userData.role,
              _id : userData.id
            }
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

userDB.verifyEmail = async(userData)=>{
  if(userData.role == 'artist'){
    const collection = await connection.getArtist();
    let artist = await collection.find({"email":userData.email})
    let profileStatus = 'Incomplete';
    if(artist.phoneVerified){
      profileStatus = 'complete'
    }
    const data = await collection.updateOne({ "email" : userData.email},
    {"$set": 
    {
      "profileStatus":profileStatus,
      "emailVerified": true
    }
  });
    if (data.modifiedCount == 1 || data.acknowledged == true) {
        let res = {
            status :200,
            data : "Email Verified"
        }
        return res
    }
    else{
        return false
    }
  }
  else if(userData.role == 'user'){
    const collection = await connection.getUsers();
    let user = await collection.find({"email":userData.email})
    let profileStatus = 'Incomplete';
    if(user.phoneVerified){
      profileStatus = 'complete'
    }
    const data = await collection.updateOne({ "email" : userData.email},
    {"$set": 
    {
      "profileStatus":profileStatus,
      "emailVerified": true
    }
  });
    if (data.modifiedCount == 1 || data.acknowledged == true) {
        let res = {
            status :200,
            data : "Email Verified"
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

userDB.addSkill = async(userData,id)=>{
  const collection = await connection.getArtist();
  let isSkillPresent = await collection.findOne({
    "skills": {
      $elemMatch: { "name": userData.name }
    }
  }, {
    "skills.$": 1
  })
  if(isSkillPresent){
    let res = {
      status :204,
      data : "Skill present already, try editing the same!"
  }
  return res
  }
  else{
    let data = await collection.updateOne({"_id":new ObjectId(id)},{$push:{"skills":userData}})
    if (data.modifiedCount == 1 && data.acknowledged == true) {
        let res = {
            status :200,
            sendMail : true,
            data : "Added Skill"
        }
        return res
    }
    else{
        return false
    }
  }
}

userDB.getArtistSkill = async(id)=>{
  const collection = await connection.getArtist();
  let skillData = await collection.findOne({"_id":new ObjectId(id)},{_id:0,skills:1})
  if(skillData.skills.length>0){
    let res = {
      status :200,
      data : skillData.skills
  }
  return res
  }
  else{
    let res = {
      status :204,
      data : "No Skills added"
  }
  return res
  }
}

userDB.updateArtistSkill = async(payload,id)=>{
  const collection = await connection.getArtist();
  // Retrieve the existing skills array element
  const existingSkills = await collection.findOne(
    {
      _id: new ObjectId(id),
      "skills.name": payload.name
    },
    {
      "skills.$": 1
    }
  );

  // Merge the existing array element with the payload
  const plainObject = existingSkills.toObject();
  // console.log(JSON.stringify(plainObject.skills[0]))
  // function mergeObjects(object1, object2) {
  //   const result = { ...object1 };
  
  //   if (Array.isArray(object1.genre) && Array.isArray(object2.genre)) {
  //     const mergedGenre = [];
  //     const genreMap = new Map();
  
  //     // Populate the map with existing items from object1
  //     object1.genre.forEach(item => genreMap.set(item.name, item));
  
  //     // Update existing items and add new ones from object2
  //     object2.genre.forEach(item => {
  //       const existingItem = genreMap.get(item.name);
  //       if (existingItem) {
  //         // Update existing item in the "genre" array, prioritizing values from object1
  //         const updatedItem = { ...item, ...existingItem };
  //         mergedGenre.push(updatedItem);
  //         genreMap.set(item.name, updatedItem); // Update map with the latest values
  //       } else {
  //         // Add new item
  //         mergedGenre.push(item);
  //       }
  //     });
  
  //     result.genre = mergedGenre;
  //   }
  
  //   // Replace other properties in object1 with those from object2
  //   for (const key in object2) {
  //     if (object2.hasOwnProperty(key) && key !== 'genre') {
  //       // Prioritize values from object1
  //       result[key] = object1[key] !== undefined ? object1[key] : object2[key];
  //     }
  //   }
  
  //   return result;
  // }
  function mergeObjects(object1, object2) {
    object1.rating = object2.rating;
    if(object2.approverId){
      object1.approverId = object2.approverId;
    }
    if(object2.genre.length == 0){
        return object1
    }
    else{
        if(object1.genre.length==0){
            return object1;
        }
        else{
            const genreMap = new Map();
            object2.genre.forEach(item => genreMap.set(item.name, item));
            object1.genre.forEach((item)=>{
                const existingItem = genreMap.get(item.name);
                if (existingItem) {
                    if(existingItem?.approverId){
                        item.approverId = existingItem.approverId 
                    }
                }
            })
            return object1;
        }
    }
  }
  const mergedObject = mergeObjects(payload, plainObject.skills[0]);
  let isUpdated = await collection.updateOne(
    {
      _id: new ObjectId(id),
      "skills.name": payload.name
    },
    {
      $set: { "skills.$": mergedObject }
    }
  );
  if(isUpdated.modifiedCount == 1){
    let res = {
      status :200,
      data : 'Successfully updated skills'
  }
  return res
  }
  else{
    let res = {
      status :204,
      data : "Unable to update skills"
  }
  return res
  }
}

userDB.addApprover = async(payload)=>{
  const collection = await connection.getTag();
  let isCreated = await collection.create(payload);
  if(isCreated){
    let res = {
      status :200,
      data : 'Successfully added approver',
      sendMail : true
  }
  return res
  }
  else{
    let res = {
      status :204,
      sendMail:false,
      data : "Unable to add approver"
  }
  return res
  }
}

userDB.allApprovers = async()=>{
  const collection = await connection.getTag();
  let data = await collection.find({role:'tag'},{password:0,history:0});
  if(data.length>0){
    let res = {
      status :200,
      data : data
  }
  return res
  }
  else{
    let res = {
      status :204,
      data : "No approver registered yet"
  }
  return res
  }
}

userDB.editApprover = async(payload)=>{
  const collection = await connection.getTag();
  let isUpdated = await collection.updateOne({_id:new ObjectId(payload.id)},{
    $set:{
      name : payload.name,
      email : payload.email,
      phoneNo : payload.phoneNo,
      skillName : payload.skillName
    }
  });
  if(isUpdated.modifiedCount == 1 || isUpdated.acknowledged == true){
    let res = {
      status :200,
      data : 'Successfully updated'
  }
  return res
  }
  else{
    let res = {
      status :204,
      data : "Unable to edit"
  }
  return res
  }
}

userDB.getSkill = async(id)=>{
  const collection = await connection.getTag();
  let skillData = await collection.findOne({'_id':new ObjectId(id)},{skillName:1,_id:0});
  if(skillData.skillName.length>0){
    return skillData.skillName
  }
  else{
    return null
  }
}

userDB.pendingArtists = async(skillarray)=>{
  const collection = await connection.getArtist();
  let artistData = await collection.aggregate([
    {
        $match: {
            "skills": {
                $elemMatch: {
                    "name": { $in: skillarray },
                    $or: [
                        { "validated": "nv" },
                        { "genre.validated": "nv" }
                    ]
                }
            }
        }
    },
    {
        $addFields: {
            "skills": {
                $filter: {
                    input: "$skills",
                    as: "skill",
                    cond: {
                        $and: [
                            { $in: ["$$skill.name", skillarray] },
                            {
                                $or: [
                                    { $eq: ["$$skill.validated", "nv"] },
                                    { $in: ["nv", "$$skill.genre.validated"] }
                                ]
                            }
                        ]
                    }
                }
            }
        }
    },
    {
        $project: {
            "name": 1,
            "email": 1,
            "phoneNo": 1,
            "skills": 1
        }
    }
])
  if(artistData.length>0){
    let res = {
      status :200,
      data : artistData
  }
  return res
  }
  else{
    let res = {
      status :204,
      data : "No Pending Artists"
  }
  return res
  }
}

userDB.approveSkill = async(payload,id)=>{
  const collection = await connection.getArtist();
  let mainUpdate;
  isFailed = false;
  if(payload.id){
    if(payload.feedback){
      mainUpdate = await collection.updateOne(
        { "skills._id": new ObjectId(payload.id)},
        {
            $set: {
                "skills.$.validated": payload.status,
                "skills.$.feedback": payload.feedback,
                "skills.$.approverId": id
            }
        }
      );
    }
    else{
      mainUpdate = await collection.updateOne(
        { "skills._id": new ObjectId(payload.id)},
        {
            $set: {
                "skills.$.validated": payload.status,
                "skills.$.approverId": id
            }
        }
      );
    }
  }
  let response = {
    data : []
  }
  if (mainUpdate?.modifiedCount == 0) {
    isFailed = true
    response.data.push(`${payload.name} status,update failed.`);
  }
if(payload?.genre?.length>0){
  for(i in payload.genre){
    let result;
    if(payload.genre[i].feedback){
      result = await collection.updateOne(
        { "skills._id": new ObjectId(payload.id), "skills.genre._id": new ObjectId(payload.genre[i].id) },
        {
            $set: {
                "skills.$[outer].genre.$[inner].validated": payload.genre[i].status,
                "skills.$[outer].genre.$[inner].feedback": payload.genre[i].feedback,
                "skills.$[outer].genre.$[inner].approverId": id
            }
        },
        {
            arrayFilters: [
                { "outer._id": payload.id },
                { "inner._id": payload.genre[i].id }
            ]
        }
    )
    }
    else{
      result = await collection.updateOne(
        { "skills._id": new ObjectId(payload.id), "skills.genre._id": new ObjectId(payload.genre[i].id) },
        {
            $set: {
                "skills.$[outer].genre.$[inner].validated": payload.genre[i].status,
                "skills.$[outer].genre.$[inner].approverId": id
            }
        },
        {
            arrayFilters: [
                { "outer._id": payload.id },
                { "inner._id": payload.genre[i].id }
            ]
        }
    )
    }
  if(result.modifiedCount == 1){
    isFailed = false
  }
  else{
    isFailed = true
    response.data.push(`Genre update ${payload.genre[i].name} failed.`);
  }
  if(i == payload.genre.length-1){
    if(isFailed){
      response.status = 204;
    }
    else{
      response.status = 200;
      response.data = 'successfully updated'
    }
    return response
  }
  }
}
else{
  if (mainUpdate?.modifiedCount == 0) {
    return response
  }
  else{
    response.status = 200;
    response.data = 'successfully updated'
    return response
  }
}
}

userDB.getArtistHistory = async(approverId)=>{
  const collection = await connection.getArtist();
  let filteredArray=[];
  await collection.find({
    $or: [
      { "skills.approverId": approverId },
      { "skills.genre.approverId": approverId }
    ]
  },{name:1,email:1,phoneNo:1,skills:1}).then((inputArray)=>{
    if(inputArray.length>0){
      filteredArray = inputArray.map((item) => {
        item.skills = item.skills.filter((skill) => {
            if (skill?.approverId === approverId) {
                return true;
            } else {
                skill.name = "N/A";
                skill.experience = 0;
                skill.portfolio = "N/A";
                skill.approverId = "N/A";
                skill.validated = "N/A";
                skill.status = "N/A";
                return true;
            }
        });
        item.skills.forEach((skill) => {
            skill.genre = skill.genre.filter((genre) => genre.approverId === approverId);
        });
        return item;
    });
    filteredArray.forEach(item => {
      item.skills = item.skills.filter(skill => skill.name !== "N/A" || skill.genre.length > 0);
  });
  }
})

if(filteredArray.length>0){
  let res = {
    status : 200,
    data:filteredArray
  }
  return res
}
else{
  let res = {
    status : 204,
    data:'Not approved anyone yet!'
  }
  return res
}
}

userDB.getAvailable = async(id)=>{
  const collection = await connection.getArtist();
  let data = await collection.findOne({"_id":new ObjectId(id)},{_id:0,availableDays:1})
if(data){
  let res = {
    status : 200,
    data:data.availableDays
  }
  return res
}
else{
  let res = {
    status : 204,
    data:'Unable to fetch available days data'
  }
  return res
}
}

userDB.updateAvailable = async(payload,id)=>{
  const collection = await connection.getArtist();
  let data = await collection.updateOne({"_id":new ObjectId(id)},{$set:{availableDays:payload}})
if(data.modifiedCount == 1 || data.acknowledged == true){
  let res = {
    status : 200,
    data:'successfully updated'
  }
  return res
}
else{
  let res = {
    status : 204,
    data:'Unable to update available days data'
  }
  return res
}
}

userDB.updateinaug = async(payload,id)=>{
  const collection = await connection.getArtist();
  let data = await collection.updateOne({"_id":new ObjectId(id)},{$set:{
    inaug : payload.status,
    inaugPrice: payload.price
  }})
if(data.modifiedCount == 1 || data.acknowledged == true){
  let res = {
    status : 200,
    data:'successfully updated'
  }
  return res
}
else{
  let res = {
    status : 204,
    data:'Unable to update inauguration data'
  }
  return res
}
}

userDB.updatewishes = async(payload,id)=>{
  const collection = await connection.getArtist();
  let data = await collection.updateOne({"_id":new ObjectId(id)},{$set:{
    wishes : payload.status,
    wishesPrice: payload.price
  }})
if(data.modifiedCount == 1 || data.acknowledged == true){
  let res = {
    status : 200,
    data:'successfully updated'
  }
  return res
}
else{
  let res = {
    status : 204,
    data:'Unable to update wishes data'
  }
  return res
}
}

userDB.getArtists = async()=>{
  const collection = await connection.getArtist();
  let inputArray = await collection.aggregate([
    {
      $match: {
        'skills.status': 'active',
        'skills.validated': 'a'
      }
    },
    {
      $project: {
        _id:1,
        name: 1,
        email: 1,
        phoneNo: 1,
        language: 1,
        address: 1,
        mandal: 1,
        district: 1,
        state: 1,
        pincode: 1,
        'skills': {
          $map: {
            input: '$skills',
            as: 'skill',
            in: {
              name: '$$skill.name',
              experience: '$$skill.experience',
              portfolio: '$$skill.portfolio',
              pricing: '$$skill.pricing',
              status: '$$skill.status',
              validated: '$$skill.validated',
              rating: '$$skill.rating',
              genre: {
                $map: {
                  input: '$$skill.genre',
                  as: 'g',
                  in: {
                    name: '$$g.name',
                    experience: '$$g.experience',
                    portfolio: '$$g.portfolio',
                    rating: '$$g.rating',
                    status: '$$g.status',
                    validated: '$$g.validated'
                  }
                }
              }
            }
          }
        }
      }
    }
  ])

  let filteredArray = []
function removeSkillsAndGenre(array) {
  for(let i of array){
    const filteredSkills = i.skills.filter(skill => skill.status === 'active' && skill.validated === 'a');
    i.skills = filteredSkills;
    filteredArray.push(i)
  }
  for(let i of filteredArray){
    for(let j of i.skills){
      const filteredGenre = j.genre.filter(genre => genre.status === 'active' && genre.validated === 'a');
      j.genre = filteredGenre;
    }
  }

}
removeSkillsAndGenre(inputArray)

// function filterSkillsAndGenre(artist) {
//   const filteredSkills = artist.skills.filter(
//     (skill) => skill.status === 'active' && skill.validated === 'a'
//   );
//   const filteredSkillsWithGenre = filteredSkills.map((skill) => ({
//     ...skill,
//     genre: skill.genre.filter((genre) => genre.status === 'active' && genre.validated === 'a'),
//   }));

//   return {
//     ...artist,
//     skills: filteredSkillsWithGenre,
//   };
// }

// const filteredArray = inputArray.map(filterSkillsAndGenre);
  
if(filteredArray.length > 0){
  let res = {
    status : 200,
    data:filteredArray
  }
  return res
}
else{
  let res = {
    status : 204,
    data:'No artist registered yet'
  }
  return res
}
}

userDB.fetchAvailable = async(id)=>{
  const collection = await connection.getArtist();
  const collection1 = await connection.history();
  let data = await collection.findOne({"_id":new ObjectId(id)},{availableDays:1})
  let available = data.availableDays
  let today = new Date()
  let bookings = await collection1.find({
    artistId: id,
    date: { $gt: today },
    status: { $in: ['a', 'pending','rescheduled'] }
  })

  let converted = {};

  for (const day in available) {
    if (day === 'mon') {
      converted[1] = available[day];
    } else if (day === 'tue') {
      converted[2] = available[day];
    } else if (day === 'wed') {
      converted[3] = available[day];
    } else if (day === 'thu') {
      converted[4] = available[day];
    } else if (day === 'fri') {
      converted[5] = available[day];
    } else if (day === 'sat') {
      converted[6] = available[day];
    } else if (day === 'sun') {
      converted[0] = available[day];
    }
  }

  let bookedDates = {}

  let response = {
    hourly : [],
    fullDay : [],
    event : []
  }

  for(let i of bookings){
    if(bookedDates[i.date] == null){
      bookedDates[i.date] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      generateAvailable(i)
    }
    else{
      generateAvailable(i)
    }
  }

  function generateAvailable(data){
    if(data.type == 'fullDay'){
      bookedDates[data.date] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    else if(data.type == 'event'){
      let mapper = {
        1 : [4,9],
        2 : [9,14],
        3 : [14,19],
        4 : [19,24],
        5 : [0,4]
      }
      let start = mapper[data.slot][0];
      let end = mapper[data.slot][1];
      for(let i = start;i<end;i++){
        bookedDates[data.date][i] = 0
      }
    }
    else if(data.type == 'hourly'){
      let start = new Date(data.from).getHours();
      let end = new Date(data.to).getHours();
      for(let i = start;i<=end;i++){
        bookedDates[data.date][i] = 0
      }
    }
  }
  let tomorrow = new Date(new Date().setDate(new Date().getDate()+1))
  while(response.fullDay.length < 10){
    let found = false;
    for(i in bookedDates){
      if(new Date(i).toDateString() == tomorrow.toDateString()){
        found = true;
        break;
      }
    }
    if(!found){
      let day = tomorrow.getDay();
      if(converted[day]){
        response.fullDay.push(new Date(tomorrow))
      }
    }
    tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1))
  }
  for(let i in bookedDates){
    if(JSON.stringify(bookedDates[i]) != JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])){
      let obj = {
        date : new Date(i),
        availableSlots : [],
        availability : bookedDates[i]
      }
      function fetchAvailableTimeSlots(arr) {
        const availableTimeSlots = [];
        let startHour = null;
        let endHour = null;
      
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === 1) {
            // If the slot is available
            if (startHour === null) {
              startHour = i;
              endHour = i;
            } else {
              endHour = i;
            }
          } else if (arr[i] === 0 && startHour !== null) {
            // If the slot is booked
            availableTimeSlots.push(formatTimeSlot(startHour, endHour));
            startHour = null;
            endHour = null;
          }
        }
      
        if (startHour !== null) {
          availableTimeSlots.push(formatTimeSlot(startHour, endHour));
        }
      
        return availableTimeSlots;
      }
      
      function formatTimeSlot(startHour, endHour) {
        // Convert hours to AM/PM format
        const startTime = formatHour(startHour);
        const endTime = formatHour(endHour+1);
      
        return `${startTime}-${endTime}`;
      }
      
      function formatHour(hour) {
        if (hour === 0) return '12 a.m';
        if (hour === 12) return '12 p.m';
        if (hour === 24) return '12 a.m';
        if (hour < 12) return `${hour} a.m`;
        return `${hour - 12} p.m`;
      }
      obj.availableSlots = fetchAvailableTimeSlots(bookedDates[i]);
      response.hourly.push(obj)

      let mapper = {
        1 : [4,9],
        2 : [9,14],
        3 : [14,19],
        4 : [19,24],
        5 : [0,4]
      }
      for(let j in mapper){
        let found = false;
        for(let k=mapper[j][0];k<mapper[j][1];k++){
          if(bookedDates[i][k] == 0){
            found = true;
            break;
          }
        }
        if(!found){
          let isFound = false
          for(let l of response.event){
            if(new Date(l.date).toDateString() == new Date(i).toDateString()){
              l.slots.push(j)
              isFound = true;
              break;
            }
          }
          if(!isFound){
            let obj = {
              date : new Date(i),
              slots : [j]
            }
            response.event.push(obj)
          }
        }
      }
    }
  }
  tomorrow = new Date(new Date().setDate(new Date().getDate()+1))
  while(response.event.length < 10){
    let found = false
    for(let i in bookedDates){
      if(new Date(i).toDateString() == tomorrow.toDateString()){
        found = true;
        break;
      }
    }
    if(!found){
      let day = tomorrow.getDay();
      if(converted[day]){
        let obj = {
          date : new Date(tomorrow),
          slots : [1,2,3,4,5]
        }
        response.event.push(obj)
      }
    }
    tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1))
  }
  tomorrow = new Date(new Date().setDate(new Date().getDate()+1))
  while(response.hourly.length < 10){
    let found = false
    for(let i in bookedDates){
      if(new Date(i).toDateString() == tomorrow.toDateString()){
        found = true;
        break;
      }
    }
    if(!found){
      let day = tomorrow.getDay();
      if(converted[day]){
        let obj = {
          date : new Date(tomorrow),
          availableSlots : ['full day available'],
          availability : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        }
        response.hourly.push(obj)
      }
    }
    tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1))
  }
  response.event.sort((a, b) => new Date(a.date) - new Date(b.date));
  response.hourly.sort((a, b) => new Date(a.date) - new Date(b.date));
  response.fullDay.sort((a, b) => new Date(a) - new Date(b));
  if(data){
    let res = {
      status : 200,
      data:response
    }
    return res
  }
  else{
    let res = {
      status : 204,
      data:'Unable to fetch available data'
    }
    return res
  }
}

userDB.bookArtist = async (payload) => {
  const collection = await connection.history();
  let date = new Date(payload.date);
  let arr = [];
  arr.push(new Date(date.setDate(date.getDate()-1)))
  arr.push(new Date(date.setDate(date.getDate()-2)))
  arr.push(new Date(date.setDate(date.getDate()-2)))
  payload.reminderDates = arr;
  let data = await collection.create(payload);
  if (data) {
    let res = {
      status: 200,
      sendMail:true,
      data: 'Booking Successfull'
    }
    return res
  }
  else {
    let res = {
      status: 204,
      sendMail:false,
      data: 'Unable to book artist'
    }
    return res
  }
}

userDB.fetchHistory = async (payload) => {
  const collection1 = await connection.history();
  let data;
  let userData;
  if(payload.role == 'user'){
    data = await collection1.find({"userId" : payload.id},{'userId':0,'reminderDates':0,'__v':0}).lean();
    const idsArray = data.map(item => item.artistId);
    const collection = await connection.getArtist();
    userData = await collection.find({ _id: { $in: idsArray } },{name:1,email:1,phoneNo:1,_id:1})
  }
  else if(payload.role == 'artist'){
    data = await collection1.find({"artistId" : payload.id},{'artistId':0,'reminderDates':0,'__v':0}).lean();
    const idsArray = data.map(item => item.userId);
    const collection = await connection.getUsers();
    userData = await collection.find({ _id: { $in: idsArray } },{name:1,email:1,phoneNo:1,_id:1})
  }
  else{
    let res = {
      status: 204,
      data: 'Invalid role'
    }
    return res
  }
  if (data.length > 0) {
    let res = {
      status: 200,
      userData: userData,
      history : data
    }
    return res
  }
  else {
    let res = {
      status: 204,
      data: 'No Bookings Yet!!'
    }
    return res
  }
}

userDB.giveArtistFeedback = async (payload) => {
  const collection = await connection.history();
  const artistCollection = await connection.getArtist();
  let data = await collection.updateOne({"_id":new ObjectId(payload.id)},{$set:{feedback:payload.feedback,rating:payload.rating,status:'c'}});
  let ratingData = await collection.find({"name":payload.name,"artistId":payload.artistId,"rating": { $exists: true }},{_id:0,rating:1,name:1});
  let rating;
  if(ratingData.length>0){
    const sumOfRatings = ratingData.reduce((sum, item) => {
      // Check if 'rating' property is present
      if (item.rating !== undefined) {
        return sum + item.rating;
      }
      return sum;
    }, 0);
    rating = sumOfRatings/ratingData.length
  }
  else{
    rating = payload.rating
  }
  let artistData = await artistCollection.updateOne({
    "skills.name": payload.name,
    "email": payload.email
  },{
    $set: {
      "skills.$.rating": rating
    }
  })
  if ((data.modifiedCount == 1 || data.acknowledged == true) && (artistData.modifiedCount == 1 || artistData.acknowledged == true)) {
    let res = {
      status: 200,
      data: 'Successfully took feedback'
    }
    return res
  }
  else {
    let res = {
      status: 204,
      data: 'Unable to take feedback'
    }
    return res
  }
}

userDB.fetchNewRequests = async (payload) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const collection = await connection.history();
  let data = await collection.find({"artistId":payload.id,date: { $gt: today }}).lean()
  const idsArray = data.map(item => item.userId);
  const collection1 = await connection.getUsers();
  let userData = await collection1.find({ _id: { $in: idsArray } },{name:1,email:1,phoneNo:1,_id:1})
  if (data.length > 0) {
    let res = {
      status: 200,
      userData : userData,
      history: data
    }
    return res
  }
  else {
    let res = {
      status: 204,
      data: 'No new requests'
    }
    return res
  }
}

userDB.updateEvent = async (payload) => {
  const collection = await connection.history();
  let data = await collection.updateOne({"_id":payload.id},{$set:{status:payload.status}})
  if (data.modifiedCount == 1 || data.acknowledged == true) {
    let res = {
      status: 200,
      data: 'Successfully updated'
    }
    return res
  }
  else {
    let res = {
      status: 204,
      data: 'Unable to update'
    }
    return res
  }
}

userDB.updateBooking = async (payload) => {
  const collection = await connection.history();
  let data;
  let date = new Date(payload.data.date);
  let arr = [];
  arr.push(new Date(date.setDate(date.getDate()-1)))
  arr.push(new Date(date.setDate(date.getDate()-2)))
  arr.push(new Date(date.setDate(date.getDate()-2)))

  if(payload.role == 'artist'){
    if(payload.data.type == 'hourly'){
      data = await collection.updateOne({"_id":payload.id},{$set:{
        date : payload.data.date,
        from : payload.data.from,
        to : payload.data.to,
        status : 'rescheduled',
        reminderDates : arr,
        rescheduledBy : payload.role
      }})
    }
    else if(payload.data.type == 'event'){
      data = await collection.updateOne({"_id":payload.id},{$set:{
        date : payload.data.date,
        status : 'rescheduled',
        slot : payload.data.slot,
        reminderDates : arr,
        rescheduledBy : payload.role
      }})
    }
    else if(payload.data.type == 'fullDay'){
      data = await collection.updateOne({"_id":payload.id},{$set:{
        status : 'rescheduled',
        date : payload.data.date,
        reminderDates : arr,
        rescheduledBy : payload.role
      }})
    }
  }
  else if(payload.role == 'user'){
    if(payload.data.bookingType == 'online'){
      if(payload.data.type == 'hourly'){
        data = await collection.updateOne({"_id":payload.id},{$set:{
          type : payload.data.type,
          date : payload.data.date,
          from : payload.data.from,
          to : payload.data.to,
          slot : '',
          price : payload.data.price,
          reminderDates : arr,
          status : 'rescheduled',
          rescheduledBy : payload.role,
          bookingType : payload.data.bookingType,
          address : '',
          mandal : '',
          district : '',
          state : '',
          pincode:''
        }})
      }
      else if(payload.data.type == 'event'){
        data = await collection.updateOne({"_id":payload.id},{$set:{
          date : payload.data.date,
          status : 'rescheduled',
          slot : payload.data.slot,
          price : payload.data.price,
          from : '',
          to : '',
          type : payload.data.type,
          reminderDates : arr,
          rescheduledBy : payload.role,
          bookingType : payload.data.bookingType,
          address : '',
          mandal : '',
          district : '',
          state : '',
          pincode:''
        }})
      }
      else if(payload.data.type == 'fullDay'){
        data = await collection.updateOne({"_id":payload.id},{$set:{
          status : 'rescheduled',
          date : payload.data.date,
          price : payload.data.price,
          type : payload.data.type,
          from : '',
          to : '',
          slot : '',
          reminderDates : arr,
          rescheduledBy : payload.role,
          bookingType : payload.data.bookingType,
          address : '',
          mandal : '',
          district : '',
          state : '',
          pincode:''
        }})
      }
    }
    else{
      if(payload.data.type == 'hourly'){
        data = await collection.updateOne({"_id":payload.id},{$set:{
          type : payload.data.type,
          date : payload.data.date,
          from : payload.data.from,
          to : payload.data.to,
          slot : '',
          price : payload.data.price,
          reminderDates : arr,
          status : 'rescheduled',
          rescheduledBy : payload.role,
          bookingType : payload.data.bookingType,
          address : payload.data.address,
          mandal : payload.data.mandal,
          district : payload.data.district,
          state : payload.data.state,
          pincode:payload.data.pincode
        }})
      }
      else if(payload.data.type == 'event'){
        data = await collection.updateOne({"_id":payload.id},{$set:{
          date : payload.data.date,
          status : 'rescheduled',
          slot : payload.data.slot,
          price : payload.data.price,
          from : '',
          to : '',
          type : payload.data.type,
          reminderDates : arr,
          rescheduledBy : payload.role,
          bookingType : payload.data.bookingType,
          address : payload.data.address,
          mandal : payload.data.mandal,
          district : payload.data.district,
          state : payload.data.state,
          pincode:payload.data.pincode
        }})
      }
      else if(payload.data.type == 'fullDay'){
        data = await collection.updateOne({"_id":payload.id},{$set:{
          status : 'rescheduled',
          date : payload.data.date,
          price : payload.data.price,
          type : payload.data.type,
          from : '',
          to : '',
          slot : '',
          reminderDates : arr,
          rescheduledBy : payload.role,
          bookingType : payload.data.bookingType,
          address : payload.data.address,
          mandal : payload.data.mandal,
          district : payload.data.district,
          state : payload.data.state,
          pincode:payload.data.pincode
        }})
      }
    }
  }
  if (data.modifiedCount == 1 || data.acknowledged == true) {
    let res = {
      status: 200,
      data: 'Successfully Rescheduled'
    }
    return res
  }
  else {
    let res = {
      status: 204,
      data: 'Unable to reschedule'
    }
    return res
  }
}

userDB.getReminder = async () => {
  const collection = await connection.history();
  let todayDate = new Date().toISOString().split('T')[0];
  let data = await collection.find({
    "$or": [
      { "date": {
        "$gte": new Date(todayDate + "T00:00:00.000Z"),
        "$lt": new Date(todayDate + "T23:59:59.999Z")
    } },
      { "reminderDates": {
        "$elemMatch": {
            "$gte": new Date(todayDate + "T00:00:00.000Z"),
            "$lt": new Date(todayDate + "T23:59:59.999Z")
        }
    } }
  ]
}, {
    "name": 1,
    "userId": 1,
    "artistId": 1,
    "date": 1,
    "from": 1,
    "to": 1,
    "slot": 1,
    "_id": 1,
    "type":1,
    "address":1,
    "mandal":1,
    "district":1,
    "state":1,
    "pincode":1,
    "bookingType":1
  }).lean();
  if (data) {
    function convertToPlainObject(data) {
      return data.map(item => {
        const { _id, ...rest } = item;
        return { ...rest, _id: _id.toString() };
      });
    }
    
    // Extract unique userIds
    const userIds = [...new Set(data.map(item => item.userId))];

    // Extract unique artistIds
    const artistIds = [...new Set(data.map(item => item.artistId))];
    const userColl = await connection.getUsers();
    const artistColl = await connection.getArtist();
    let userData = await userColl.find({
      "_id": { "$in": userIds }
      },{name:1,email:1,phoneNo:1}).lean();
    let artistData = await artistColl.find({
      "_id": { "$in": artistIds }
      },{name:1,email:1,phoneNo:1}).lean();
      userData = convertToPlainObject(userData)
      artistData = convertToPlainObject(artistData)
      const userMap = new Map(userData.map(user => [user._id, user]));
      const artistMap = new Map(artistData.map(artist => [artist._id, artist]));
      for(let i of data){
        let userInfo = userMap.get(i.userId);
        let artistInfo = artistMap.get(i.artistId);
        if(userInfo){
          i.candName = userInfo.name;
          i.candPhone = userInfo.phoneNo;
          i.candEmail = userInfo.email;
        }
        if(artistInfo){
          i.artistName = artistInfo.name;
          i.artistPhone = artistInfo.phoneNo;
          i.artistEmail = artistInfo.email;
        }
      }
    if(data.length>0){
      return data
    }
    else{
      return false
    }
  }
  else return false;
}

userDB.fetchUserAndArtist = async (payload) => {
  const userCollection = await connection.getUsers();
  const artistCollection = await connection.getArtist();
  let userData = await userCollection.findOne({"_id":payload.userId},{name:1,email:1,phoneNo:1});
  let artistData = await artistCollection.findOne({"_id":payload.artistId},{name:1,email:1,phoneNo:1});
  let newData = {
    candName : userData.name,
    candPhone : userData.phoneNo,
    candEmail : userData.email,
    artistName : artistData.name,
    artistPhone : artistData.phoneNo,
    artistEmail : artistData.email
  }
  if (newData.candName && newData.artistName) {
    return newData
  }
  else {
    return false
  }
}

userDB.fetchTag = async (payload) => {
  const tagCollection = await connection.getTag();
  let userData = await tagCollection.find({"skillName":payload},{name:1,email:1});
  if (userData) {
    return userData
  }
  else {
    return false
  }
}

userDB.fetchArtistDashboardData = async (payload) => {
  const historyCollection = await connection.history();
  const artistCollection = await connection.getArtist();
  const userCollection = await connection.getUsers();
  let artistData = await artistCollection.findOne({"_id":new ObjectId(payload._id)}).lean();
  let output = {};
  output.inaug = artistData.inaug;
  output.inaugPrice = artistData.inaugPrice;
  output.wishes = artistData.wishes;
  output.wishesPrice = artistData.wishesPrice;
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate()+1);
  let userStatistics = {
    inProgress : 0,
    completed : 0,
    rejected : 0
  }
  let todayEvents = [];
  let pastEvents = [];
  let upComingEvents = [];
  let allDates = [];
  let eventData = await historyCollection.find({"artistId":payload._id}).lean();
  for(let i of eventData){
    allDates.push(i.date)
    if(i.status == "c"){
      userStatistics.completed += 1
    }
    else if(i.status == "r"){
      userStatistics.rejected += 1
    }
    else if(i.status == 'pending' || i.status == 'rescheduled' || i.status == 'a'){
      userStatistics.inProgress += 1
    }
    let obj = {};
    if(new Date(i.date).toDateString() == new Date().toDateString()){
      let userData = await userCollection.findOne({"_id":new ObjectId(i.userId)},{_id:0,name:1,email:1,phoneNo:1}).lean();
      obj.candName = userData.name;
      obj.candPhoneNo = userData.phoneNo;
      obj.candEmail = userData.email;
      let time = new Date();
      let minutes = time.getMinutes()
      if (0<=minutes && minutes<30) {
        time.setMinutes(0);
        time.setMilliseconds(0);
      } else if (30<=minutes && minutes<=59) {
        time.setMinutes(30);
        time.setMilliseconds(0);
      }
      if((new Date(i.date).getHours() == time.getHours()) && (new Date(i.date).getMinutes() == time.getMinutes())){
        obj.onGoing = true;
      }
      else if(new Date(i.date) < time){
        obj.past = true
      }
      else if(new Date(i.date) > time){
        obj.future = true
      }
      if(i.status == 'c' || i.status == 'a'){
        obj.class = 'badge badge-gradient-success'
      }
      else if(i.status == 'r' || i.status == 'pending' || i.status == 'rescheduled'){
        obj.class = 'badge badge-gradient-danger'
      }
      todayEvents.push(obj)
    }
    else if((new Date(i.date) < new Date()) && !i.feedback && i.date){
      let userData = await userCollection.findOne({"_id":new ObjectId(i.userId)},{_id:0,name:1,email:1,phoneNo:1}).lean();
      obj.candName = userData.name;
      obj.candPhoneNo = userData.phoneNo;
      obj.candEmail = userData.email;
      obj.class = 'badge badge-gradient-warning';
      pastEvents.push(obj);
    }
    else if(new Date(i.date).toDateString() == tomorrow.toDateString()){
      let userData = await userCollection.findOne({"_id":new ObjectId(i.userId)},{_id:0,name:1,email:1,phoneNo:1}).lean();
      obj.candName = userData.name;
      obj.candPhoneNo = userData.phoneNo;
      obj.candEmail = userData.email;
      upComingEvents.push(obj)
    }
    if(obj?.candName){
      obj.name = i.name;
      obj.date = i.date;
      obj.status = i.status;
      obj.type = i.type;
      obj.bookingType = i.bookingType;
      obj.price = i.price;
      obj.paid = i.paid;
      if(i.type == 'hourly'){
        obj.from = i.from;
        obj.to = i.to;
      }
      else if(i.type == 'event'){
        obj.slot = i.slot;
      }
      if(i.bookingType == 'onsite'){
        obj.address = i.address;
        obj.mandal = i.mandal;
        obj.district = i.district;
        obj.state = i.state;
        obj.pincode = i.pincode;
      }
    }
  }
  output.todayEvents = todayEvents;
  output.pastEvents = pastEvents;
  output.upComingEvents = upComingEvents;
  output.userStatistics = userStatistics;
  if (allDates.length > 0) {
    const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG",
    "SEP","OCT","NOV","DEC"];

    let out = {JAN: 0,FEB: 0,MAR: 0,APR: 0,MAY: 0,JUN: 0,JUL: 0,
      AUG: 0,SEP: 0,OCT: 0,NOV: 0,DEC: 0};

      function flattenArray(arr){
        return arr.reduce((acc,val)=> acc.concat(Array.isArray(val) ? flattenArray(val):val),[]);
      }

      const datesArray = flattenArray(allDates)
      .filter(item => new Date(item).toString() !== 'Invalid Date')
      .map(dateString => new Date(dateString));

      for(i of datesArray){
        out[monthNames[new Date(i).getMonth()]] += 1;
      }

    let arr = [];

    for (i in out) {
      arr.push(out[i]);
    }
    output.graphData = arr
  }
  if (output) {
    let res = {
      status : 200,
      data : output
    }
    return res
  }
  else {
    return false
  }
}

userDB.fetchUserDashboardData = async (payload) => {
  const historyCollection = await connection.history();
  const artistCollection = await connection.getArtist();
  let output = {};
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate()+1);
  let userStatistics = {
    inProgress : 0,
    completed : 0,
    rejected : 0
  }
  let todayEvents = [];
  let pastEvents = [];
  let upComingEvents = [];
  let allDates = [];
  let eventData = await historyCollection.find({"userId":payload._id}).lean();
  for(let i of eventData){
    allDates.push(i.date)
    if(i.status == "c"){
      userStatistics.completed += 1
    }
    else if(i.status == "r"){
      userStatistics.rejected += 1
    }
    else if(i.status == 'pending' || i.status == 'rescheduled' || i.status == 'a'){
      userStatistics.inProgress += 1
    }
    let obj = {};
    if(new Date(i.date).toDateString() == new Date().toDateString()){
      let userData = await artistCollection.findOne({"_id":new ObjectId(i.artistId)},{_id:0,name:1,email:1,phoneNo:1}).lean();
      obj.candName = userData.name;
      obj.candPhoneNo = userData.phoneNo;
      obj.candEmail = userData.email;
      let time = new Date();
      let minutes = time.getMinutes()
      if (0<=minutes && minutes<30) {
        time.setMinutes(0);
        time.setMilliseconds(0);
      } else if (30<=minutes && minutes<=59) {
        time.setMinutes(30);
        time.setMilliseconds(0);
      }
      if((new Date(i.date).getHours() == time.getHours()) && (new Date(i.date).getMinutes() == time.getMinutes())){
        obj.onGoing = true;
      }
      else if(new Date(i.date) < time){
        obj.past = true
      }
      else if(new Date(i.date) > time){
        obj.future = true
      }
      if(i.status == 'c' || i.status == 'a'){
        obj.class = 'badge badge-gradient-success'
      }
      else if(i.status == 'r' || i.status == 'pending' || i.status == 'rescheduled'){
        obj.class = 'badge badge-gradient-danger'
      }
      todayEvents.push(obj)
    }
    else if((new Date(i.date) < new Date()) && !i.feedback && i.date){
      let userData = await artistCollection.findOne({"_id":new ObjectId(i.artistId)},{_id:0,name:1,email:1,phoneNo:1}).lean();
      obj.candName = userData.name;
      obj.candPhoneNo = userData.phoneNo;
      obj.candEmail = userData.email;
      obj.class = 'badge badge-gradient-warning';
      pastEvents.push(obj);
    }
    else if(new Date(i.date).toDateString() == tomorrow.toDateString()){
      let userData = await artistCollection.findOne({"_id":new ObjectId(i.artistId)},{_id:0,name:1,email:1,phoneNo:1}).lean();
      obj.candName = userData.name;
      obj.candPhoneNo = userData.phoneNo;
      obj.candEmail = userData.email;
      upComingEvents.push(obj)
    }
    if(obj?.candName){
      obj.name = i.name;
      obj.date = i.date;
      obj.status = i.status;
      obj.type = i.type;
      obj.bookingType = i.bookingType;
      obj.price = i.price;
      obj.paid = i.paid;
      if(i.type == 'hourly'){
        obj.from = i.from;
        obj.to = i.to;
      }
      else if(i.type == 'event'){
        obj.slot = i.slot;
      }
      if(i.bookingType == 'onsite'){
        obj.address = i.address;
        obj.mandal = i.mandal;
        obj.district = i.district;
        obj.state = i.state;
        obj.pincode = i.pincode;
      }
    }
  }
  output.todayEvents = todayEvents;
  output.pastEvents = pastEvents;
  output.upComingEvents = upComingEvents;
  output.userStatistics = userStatistics;
  if (allDates.length > 0) {
    const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG",
    "SEP","OCT","NOV","DEC"];

    let out = {JAN: 0,FEB: 0,MAR: 0,APR: 0,MAY: 0,JUN: 0,JUL: 0,
      AUG: 0,SEP: 0,OCT: 0,NOV: 0,DEC: 0};

      function flattenArray(arr){
        return arr.reduce((acc,val)=> acc.concat(Array.isArray(val) ? flattenArray(val):val),[]);
      }

      const datesArray = flattenArray(allDates)
      .filter(item => new Date(item).toString() !== 'Invalid Date')
      .map(dateString => new Date(dateString));

      for(i of datesArray){
        out[monthNames[new Date(i).getMonth()]] += 1;
      }

    let arr = [];

    for (i in out) {
      arr.push(out[i]);
    }
    output.graphData = arr
  }
  if (output) {
    let res = {
      status : 200,
      data : output
    }
    return res
  }
  else {
    return false
  }
}

module.exports = userDB