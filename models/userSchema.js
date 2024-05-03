const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

const userModel = new mongoose.Schema({
    fullname:{
        type:String,
        trim:true,
        required: [true,"Name Is Required"],
        minLength:[4,"Name must be atleast 4 characters long"]
    },
    username:{
        type:String,
        trim:true,
        unique:true,
        required: [true,"Name Is Required"],
        minLength:[4,"Name must be atleast 4 characters long"]
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required: [true,"Name Is Required"],
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    },
    password:{
        type:String
    }
},{timestamps:true})

userModel.plugin(plm)

const user = mongoose.model('user',userModel)

module.exports = user