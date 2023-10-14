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

const artistDetails = Schema({
    name:String,
    email:String,
    phoneNo:String,
    password:String,
    otp:Number,
    profileStatus :{type:String,default:'Incomplete'},
    availableDays : [Number],
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