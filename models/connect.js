const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('DataBase Connected'))
.catch(err => console.log(err))