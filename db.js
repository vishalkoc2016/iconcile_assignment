const mongoose = require("mongoose");

const mongoUrl = 'mongodb+srv://vishalkoc2016:Vishal%408757@cluster0.hggvwih.mongodb.net/mern-rooms';

mongoose.connect(mongoUrl, {useUnifiedTopology: true,useNewUrlParser:true })

var connection = mongoose.connection;


connection.on('error',()=>{
    console.log("MongoDB Connection Failed");
})

connection.on('connected',()=>{
    console.log("MongoDB Connection Successful");
})

module.exports = mongoose;
