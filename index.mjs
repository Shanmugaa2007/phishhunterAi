import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import mongoose from "mongoose";
import axios from "axios";
import cookieParser from "cookie-parser";
import { UserData } from "./mongooseSchema/registration.mjs";
import { ScanHis } from "./mongooseSchema/scanhistory.mjs"
import { hashing , comparepassword } from "./hashing/hashpassword.mjs"

dotenv.config();

const app = express();

app.use(cors({origin:["http://localhost:5173"],Credentials:true}))

app.use(express.json());
app.use(cookieParser());

let PORT = process.env.PORT || 5000;


mongoose
    .connect("mongodb+srv://zenvy:zenvy26@cluster0.krjlrpp.mongodb.net/PhishHunterAi")
    .then(()=>{
        console.log("MongoDB Connected.")
    })

    .catch(err=>{
        console.log(err.message);
    })


    app.get("/",(req,res)=>{
    res.json({msg:"Root Url"})
})

app.post("/api/register",async(req,res)=>{
    req.body.password = await hashing(req.body.password)
    const {name,password,email,phoneNumber} = req.body;
    try{
        const User = await UserData.findOne({email:email})
        if(User)
            return res.status(400).json("User already exists")
        const newuser = new UserData({
            name,password,email,phoneNumber
        })
        await newuser.save();
        res.status(201).json("User Registered Successully");
    }catch(err){
        res.status(500).json("Internal server error")
        console.log(err)
    }
})

app.post("/api/login",async(req,res)=>{
    
    const { email,password } = req.body;
    const user = await UserData.findOne({email:email});
    const ismatch = comparepassword(password,user.password);
    if(!user || !ismatch)
        return res.status(400).json("Invalid User")
    
    const token = jwt.sign(
        {id:user._id},
        "THIS IS MY SECRET",
        {expiresIn:"1hr"}
    )
    res.cookie("token",token,{httpOnly:true})

    res.json("Login Successfull")
})

const authendicatemiddleware = (req,res,next)=>{
    const token = req.cookies.token;

    if(!token)
        return res.status(400).json("User not logged In")
    try{
        const decode = jwt.verify(token,"THIS IS MY SECRET");
        req.user = decode;
        next();
    }catch(err){
        res.status(401).json("Invalid token")
    }
}

app.post("/api/logout",(req,res)=>{
    res.clearCookie("token");
    res.json("User Logout")
})

app.get("/api/profile",authendicatemiddleware,async(req,res)=>{

    try{
        const user = await UserData.findById(req.user.id)
        res.json(user)
    }catch(err){
        res.status(301).json("Unauthorized User")
    }
})

app.post("/api/aiscore",async(req,res)=>{

    const content = req.body.message
    console.log(content)
    try{
        const response = await axios.post("https://pythonai-b52u.onrender.com/check",{message:content})
        const data = new ScanHis({scannedInput:content,aiscore:response.data.risk_score,risklevel:response.data.result,type:response.data.type})
        await data.save();
        console.log(data);
        res.json(response.data)
    }
    catch(err){
        res.status(400).json(err)
    }

})

app.get("/api/history/:userId",async(req,res)=>{
    try{
        const { userId } = req.params;
        const history = await ScanHis.find({user:userId})
        res.json(history);
    }
    catch(err){
        res.status(404).json("No Results Found")
    }
})

app.listen(PORT,()=>{
    console.log(`The Port is connected on ${PORT}`)
})