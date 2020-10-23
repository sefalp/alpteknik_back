const mongoose = require('mongoose')

var url = process.env.MONGO_URL

mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


