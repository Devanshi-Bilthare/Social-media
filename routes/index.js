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
    const {fullname, username, email, password} = req.body
    await User.register({fullname,username,email},password)
    res.redirect('/login')
  }catch(err){
    res.send(err.message)
  }
})

router.get('/login',(req,res)=>{
  res.render('login')
})

router.get('/profile',(req,res)=>{
  res.render('profile')
})

module.exports = router;
