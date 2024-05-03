const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/socialMediaUser')
.then(() => console.log('DataBase Connected'))
.catch(err => console.log(err))