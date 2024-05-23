var express = require('express');
var router = express.Router();
const fs = require('fs')
const path = require('path')

const upload= require('../utils/multer').single('profilepic')
const User = require('../models/userSchema')

const sendmail = require("../utils/mail");

const passport = require('passport')
const localStrategy = require('passport-local')

passport.use(new localStrategy(User.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index')
});

router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/register',async (req,res)=>{
  try{
    const {firstname,lastname, username, email, password} = req.body
    await User.register({firstname,lastname,username,email},password)
    res.redirect('/login')
  }catch(err){
    res.send(err.message)
  }
})

router.get('/login',(req,res)=>{
  res.render('login')
})

router.post('/login',
passport.authenticate('local',{
  successRedirect:"/profile",
  failureRedirect:'/login'
})
,(req,res,next)=>{

})

router.get('/profile',isLoggedIn,(req,res)=>{
  res.render('profile',{user:req.user})
})

router.get('/userUpdate/:id',(req,res)=>{
  res.render('userUpdate',{user:req.user})
})

router.post('/userUpdate/:id',async(req,res)=>{
  try{
    const {id} = req.params
    await User.findByIdAndUpdate(id,req.body)
    res.redirect('/profile')
  }catch(err){
    res.send(err)
  }
})

router.post('/image/:id',isLoggedIn,upload,async (req,res)=>{
  try{
    const {id}= req.params
    if(req.user.profilepic !== "default.png"){
      fs.unlinkSync(path.join(__dirname,'..','public','images',req.user.profilepic))
    }
    req.user.profilepic = req.file.filename
    await req.user.save()
    res.redirect(`/userUpdate/${id}`)
  }catch(err){
    res.send(err)
  }

})

router.get('/delete/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const deletedUser = await User.findByIdAndDelete(id)
    if(deletedUser.profilepic !== "default.png"){
      fs.unlinkSync(path.join(__dirname,'..','public','images',deletedUser.profilepic))
    }
    res.redirect('/login')
  }catch(err){
    res.send(err)
  }
})

router.get('/logout',(req,res)=>{
  req.logOut(()=>{
    res.redirect('/login')
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/login')
  }
}

router.get('/resetPassword/:id',(req,res)=>{
  res.render('resetPassword',{user:req.user})
})

router.post('/resetPassword/:id',async(req,res)=>{
  try{
    await req.user.changePassword(req.body.oldpassword,req.body.newpassword)
    req.user.save()
    res.redirect(`/userUpdate/${req.user._id}`)
  }catch(err){
    res.send(err)
  }
})

router.get('/forgot-email',(req,res)=>{
  res.render('forgotEmail',{user:req.user})
})

router.post('/forgot-email',async (req,res)=>{
  try{
    const user = await User.findOne({email:req.body.email})
    if(user){
      // res.send('csk')
      sendmail(res, req.body.email, user);
      // res.redirect(`/forgot-password/${user._id}`)
    }else{
      res.redirect('/forgot-email')
    }
  }catch(err){
    res.send(err)
  }
})

router.get('/forgot-password/:id',(req,res)=>{
  res.render('forgotPassword',{id :req.params.id})
})


router.post('/forgot-password/:id',async (req,res)=>{
  try{
    const user = await User.findById(req.params.id)
    // await user.setPassword(req.body.password)
    // await user.save()
    if (user.resetPasswordToken == 1) {
      await user.setPassword(req.body.password);
      user.resetPasswordToken = 0;
      await user.save();
  } else {
      res.send("Link Expired Try Again!");
  }
    res.redirect('/login')
  }catch(err){
    res.send(err)
  }
})


module.exports = router;

