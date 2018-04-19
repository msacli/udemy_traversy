const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const app = express();

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

app.get('/', (req,res)=>res.send('hello'));

//use routes

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`server runing on port ${port}`)
});
