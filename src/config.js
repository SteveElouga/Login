const mongoose = require("mongoose")
const connect = mongoose.connect("mongodb+srv://nyobe:macabolune2002@cluster0.bet7mwr.mongodb.net/login")

//check database connected or not
connect.then(()=>{
    console.log("Database connected Succesfully")
}).catch(()=>{
    console.log("Database cannot be connected")
})

//Create a schema

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//collection Part
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;