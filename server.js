const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const app = express();

// body paer middle ware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// connect to mongodb
mongoose
    .connect(db)
    .then(()=>{
        console.log('mongo db connection established');
    })
    .catch((err)=>{
        console.log('couldnt connect', err);
    });

// poasport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport.js')(passport);

//use routes

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`server runing on port ${port}`)
});
