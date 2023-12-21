const jwt = require('jsonwebtoken');

let verifyToken = (req,res,next) =>{
    try {
        const token = req.headers?.authorization;
        if(!token){
           let response = {
            status : 204,
            data : 'You are not Authenticated'
           }
           res.status(400).json(response)
        }
        else{
            jwt.verify(token,process.env.JWT_Secret,(err,user)=>{
                if(err){
                    let response = {
                        status : 204,
                        data : 'Session Expired'
                    }
                    res.status(400).json(response)
                }
                else{
                    req.user = user;
                    next();
                }
            });
        }
    }
    catch(err){
        let response = {
            status : 204,
            data : err.message
        }
        res.json(response)
    }
}

module.exports = verifyToken;