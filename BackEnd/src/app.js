require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routing');
// const myErrorLogger = require('./utilities/errorLogger');
// const myRequestLogger = require('./utilities/requestLogger');
const cors = require("cors");
const app = express();
const cron = require('node-cron');
const userservice = require("./service/users");

app.use(cors());
app.use(bodyParser.json());

app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Methods", "DELETE, PUT");
     res.header(
       "Access-Control-Allow-Headers",
       "Origin, X-Requested-With, Content-Type, Accept"
     );
     next();
});
   
cron.schedule('40 10 * * *', () => {
  // userservice.getReminder(new Date().toDateString())
});

// app.use(myRequestLogger);
app.use('/',router);
// app.use(myErrorLogger);

port = process.env.PORT || 1204;
app.listen(port);
console.log(`server listening on port ${port}`);

module.exports = app;