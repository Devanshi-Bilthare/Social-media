var express = require('express');
var router = express.Router();

const User = require('../models/userSchema')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index')
});

router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/register',async (req,res)=>{
  try{
    const newUser = new User(req.body)
    await newUser.save()
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
