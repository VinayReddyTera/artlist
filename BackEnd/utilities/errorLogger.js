const fs = require('fs');

let errorLogger = (err,req,res,next) =>{
    if(err){
        fs.appendFile('ErrorLogger.txt', new Date() + "-" + err.stack + "\n", (error)=>{
            if(error){
                console.log("Failed in Logging Error");
            }
        });
        if(err.status){
            res.status(err.status)
        }
        else{
            res.status(500);
        }
        res.json({"message" : err.message})
    }
    next();
}

module.exports = errorLogger;