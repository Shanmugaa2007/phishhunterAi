import mongoose from "mongoose";

const UserRegistrationSchema = new mongoose.Schema({
    name:{
        type:mongoose.Schema.Types.String,
        required:true
    },
    email:{
        type:mongoose.Schema.Types.String,
        required:true,
        unique:true
    },
    password:{
        type:mongoose.Schema.Types.String,
        required:true
    },
    phoneNumber:{
        type:mongoose.Schema.Types.Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

export const UserData = mongoose.model('User',UserRegistrationSchema);