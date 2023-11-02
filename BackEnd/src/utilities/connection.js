const { Schema } = require("mongoose");
const Mongoose = require("mongoose");
Mongoose.Promise = global.Promise;
Mongoose.set('strictQuery', true);
const url = process.env.MONGO_URL;
const moment = require('moment');

const users = Schema({
    name:String,
    email:String,
    phoneNo:String,
    password:String,
    role:String,
    otp:Number,
    profileStatus :{type:String,default:'Incomplete'},
    emailVerified : {type:Boolean,default:false},
    phoneVerified : {type:Boolean,default:false},
    history : [
        {
            date : Date,
            artistId : String,
            feedback : String
        }
    ],
    createdOn: {
         type: Date,
         default: moment().format("YYYY-MM-DD HH:mm:ss")
    }
},{collection : "users"});

const tag = Schema({
    name:String,
    email:String,
    phoneNo:String,
    password:String,
    role:String,
    skillName:[String],
    language:[String],
    status : {type:String,default:'active'},
    otp:Number,
    history : [
        {
            date : Date,
            skillId : String,
            feedback : String
        }
    ],
    createdOn: {
         type: Date,
         default: moment().format("YYYY-MM-DD HH:mm:ss")
    }
},{collection : "tag"});

const artistDetails = Schema({
    name:String,
    email:String,
    phoneNo:String,
    password:String,
    otp:Number,
    language:[String],
    address : String,
    mandal : String,
    district:String,
    state:String,
    pincode:Number,
    role:String,
    emailVerified : {type:Boolean,default:false},
    phoneVerified : {type:Boolean,default:false},
    profileStatus :{type:String,default:'Incomplete'},
    availableDays : [
        {
            day: String,
            available: Boolean
        }
    ],
    currency : {type:String,default:'inr'},
    skills : [
        {
            name : String,
            status : String,
            genre : [
                {
                    name : String,
                    experience : Number,
                    portfolio : [String],
                    status : String,
                    validated : {type:String,default:'nv'},
                    approverId : String,
                    feedback:String
                }
            ],
            validated : {type:String,default:'nv'},
            experience : Number,
            portfolio : [String],
            approverId : String,
            feedback : String,
            pricing : {
                hourly : Number,
                event : Number,
                fullDay : Number
            }
        }
    ],
    history : [
        {
            date : Date,
            userId : String
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
            date: { type: Date, default: Date.now }
        }
    ]
},{collection : "feedback"})

let collection = {}

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

collection.getTag = () => {
    return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((database)=>{
        return database.model('tag',tag)
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