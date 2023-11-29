const mongoose = require("mongoose")
const connect = mongoose.connect("mongodb+srv://nyobe:macabolune2002@cluster0.bet7mwr.mongodb.net/login")

//check database connected or not
connect.then(() => {
    console.log("Database connected Succesfully")
}).catch(() => {
    console.log("Database cannot be connected")
})

//Create a schema

const LoginSchema = new mongoose.Schema({
    googleId:{
        type: String
    },
    firstname: {
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    username:{
        type: String
    },
    email: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    sexe: {
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