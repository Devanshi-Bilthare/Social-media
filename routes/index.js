var express = require('express');
var router = express.Router();

const User = require('../models/userSchema')

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



module.exports = router;

