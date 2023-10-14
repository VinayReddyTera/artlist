const { Schema } = require("mongoose");
const Mongoose = require("mongoose");
Mongoose.Promise = global.Promise;
Mongoose.set('strictQuery', true);
const url = process.env.MONGO_URL;
const moment = require('moment');

const tokens = Schema({
    email:String,
    token_type : String,
    scope : String,
    expires_in : Number,
    ext_expires_in : Number,
    access_token : String,
    refresh_token : String
},{collection : "tokens"});

const googleTokens = Schema({
    email:String,
    token_type : String,
    scope : String,
    expires_in : Number,
    ext_expires_in : Number,
    access_token : String,
    refresh_token : String
},{collection : "googleTokens"});

const users = Schema({
    name:String,
    email:String,
    phoneNo:String,
    password:String,
    otp:Number,
    pastInterviews : [
        {
            interviewDate : Date,
            userId : String,
            interviewerId : String,
            feedback : String
        }
    ],
    createdOn: {
         type: Date,
         default: moment().format("YYYY-MM-DD HH:mm:ss")
    }
},{collection : "users"});

const artistDetails = Schema({
    name:String,
    email:String,
    phoneNo:String,
    password:String,
    otp:Number,
    profileStatus :{type:String,default:'Incomplete'},
    artistId : String,
    MCalendar : {type:Boolean,default:false},
    GCalendar : {type:Boolean,default:false},
    availableDays : [
        {
            day : String,
            from : String,
            to : String,
            isNotAvailable : Boolean
        }
    ],
    pastInterviews : [
        {
            interviewDate : Date,
            userId : String,
            interviewerId : String,
            feedback : String
        }
    ],
    createdOn: {
         type: Date,
         default: moment().format("YYYY-MM-DD HH:mm:ss")
    }
},{collection : "artistDetails"});

const feedback = Schema({
    name: String,
    email: String,
    feedbacks: [
        {
            feedbackType: String,
            feedback: String,
            emotion: String,
            dateOfCreation: { type: Date, default: Date.now }
        }
    ]
},{collection : "feedback"})

let collection = {}

collection.getToken = () => {
    return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((database)=>{
        return database.model('tokens',tokens)
    }).catch((error)=>{
        let err = new Error("Could not connect to database " + error);
        err.status = 500;
        throw err;
    })
}

collection.getGoogleToken = () => {
    return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((database)=>{
        return database.model('googleTokens',googleTokens)
    }).catch((error)=>{
        let err = new Error("Could not connect to database " + error);
        err.status = 500;
        throw err;
    })
}

collection.getUsers = () => {
    return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((database)=>{
        return database.model('users',users)
    }).catch((error)=>{
        let err = new Error("Could not connect to database " + error);
        err.status = 500;
        throw err;
    })
}

collection.getArtist = () => {
    return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((database)=>{
        return database.model('artistDetails',artistDetails)
    }).catch((error)=>{
        let err = new Error("Could not connect to database " + error);
        err.status = 500;
        throw err;
    })
}

collection.feedback = () => {
    return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((database)=>{
        return database.model('feedback',feedback)
    }).catch((error)=>{
        let err = new Error("Could not connect to database " + error);
        err.status = 500;
        throw err;
    })
}

module.exports = collection