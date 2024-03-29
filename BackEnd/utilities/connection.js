const { Schema } = require("mongoose");
const Mongoose = require("mongoose");
Mongoose.Promise = global.Promise;
Mongoose.set('strictQuery', true);
const url = process.env.MONGO_URL;
const moment = require('moment');

const withdrawHistorySchema = Schema({
    amount: Number,
    status: { type: String, default: 'Pending' },
    date: Date
});

const walletHistorySchema = Schema({
    amount: Number,
    type: String,
    date: Date
});

const users = Schema({
    name:String,
    email:String,
    phoneNo:String,
    password:String,
    role:String,
    otp:Number,
    walletHistory : [walletHistorySchema],
    withdrawHistory:[withdrawHistorySchema],
    wallet : {type:Number,default:0},
    profileStatus :{type:String,default:'Incomplete'},
    emailVerified : {type:Boolean,default:false},
    phoneVerified : {type:Boolean,default:false},
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
    inaug : {type:Boolean,default:false},
    wishes: {type:Boolean,default:false},
    wallet : {type:Number,default:0},
    walletHistory : [walletHistorySchema],
    withdrawHistory:[withdrawHistorySchema],
    inaugPrice : Number,
    wishesPrice: Number,
    address : String,
    mandal : String,
    district:String,
    state:String,
    pincode:Number,
    role:String,
    emailVerified : {type:Boolean,default:false},
    phoneVerified : {type:Boolean,default:false},
    profileStatus :{type:String,default:'Incomplete'},
    availableDays : {type:Object,default:{
        'mon':true,
        'tue':true,
        'wed':true,
        'thu':true,
        'fri':true,
        'sat':true,
        'sun':true
    }},
    currency : {type:String,default:'inr'},
    skills : [
        {
            name : String,
            status : String,
            rating : {type:Number,default:0},
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
                fullDay : Number,
                oHourly : Number,
                oEvent : Number,
                oFullDay : Number
            }
        }
    ],
    createdOn: {
         type: Date,
         default: moment().format("YYYY-MM-DD HH:mm:ss")
    }
},{collection : "artistDetails"});

const history = Schema({
    date : Date,
    from : Date,
    to : Date,
    slot : Number,
    userId : String,
    artistId : String,
    feedback : String,
    rating:Number,
    remarks:String,
    modifiedBy:String,
    refundStatus:{type:String,default:'negative'},
    refundRequested : {type:Boolean,default:false},
    refundAccepted : String,
    refundReason : String,
    pricing : Object,
    inaug: {type:Boolean,default:false},
    wishes: {type:Boolean,default:false},
    type : String,
    bookingType : String,
    address : String,
    paymentId:[String],
    arrear:Number,
    mandal : String,
    district:String,
    state:String,
    pincode:Number,
    reminderDates : [Date],
    status : {type:String,default:'pending'},
    name:String,
    price : Number,
    paid : {type:Boolean,default:false},
    paymentType : String,
    commission : Number,
    commissionPaid : {type:String,default:'Not Paid'}
},{collection : "history"});

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

collection.history = () => {
    return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((database)=>{
        return database.model('history',history)
    }).catch((error)=>{
        let err = new Error("Could not connect to database " + error);
        err.status = 500;
        throw err;
    })
}

module.exports = collection