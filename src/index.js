const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require("./config")

const app = express();

//convert data into json format
app.use(express.json())

app.use(express.urlencoded({extended: false}))

//ues EJS as the view engine 
app.set('view engine', 'ejs');

//static file
app.use(express.static("public"))

app.get("/", (req, res)=>{
    res.render("login")
});

app.get("/signup", (req, res)=>{
    res.render("signup")
    }
)

//Register User
app.post("/signup", async (req, res)=>{
    
    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    //check if the user already exists in database
    const existingUser = await collection.findOne({email: data.email})
    if(existingUser){
        res.send("User already exists. Please choose a different email.")
    }else{
        // hash the password using bcrypt
        const saltRounds = 10; //Number of salt round for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds)

        data.password = hashedPassword;

        const userdata = await collection.insertMany(data)
        console.log(userdata)
        res.render("login")
    }
    }
)

//Login user
app.post("/login", async (req, res)=>{
    try{
        const check = await collection.findOne({email: req.body.email})
        if(!check){
            res.send("user name cannot found")
        }

        //Compare the hash password from database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
        if(isPasswordMatch){
            res.render("home")
        }else{
            req.send("wrong Password")
        }
    }catch{
        res.send("Informations are not correct")
    }
})

// app.put("/login", async (req, res)=>{

// })

const port = 5000;
app.listen(port,()=>{
   console.log('Server running on Port: ' + port);
})