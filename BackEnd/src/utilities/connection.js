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

const admin = Schema({
    name:String,
    email:String,
    phoneNo:String,
    password:String,
    otp:Number,
    createdOn: {
         type: Date,
         default: moment().format("YYYY-MM-DD HH:mm:ss")
    }
},{collection : "admin"});

const artistDetails = Schema({
    name:String,
    email:String,
    phoneNo:String,
    password:String,
    otp:Number,
    address : String,
    mandal : String,
    district:String,
    state:String,
    pincode:Number,
    emailVerified : {type:Boolean,default:false},
    phoneVerified : {type:Boolean,default:false},
    profileStatus :{type:String,default:'Incomplete'},
    availableDays : [Number],
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
                    validated : {type:Boolean,default:false},
                    approverId : String,
                    feedback:String
                }
            ],
            validated : {type:Boolean,default:false},
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

collection.getAdmin = () => {
    return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((database)=>{
        return database.model('admin',admin)
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