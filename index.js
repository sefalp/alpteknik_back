const express = require('express')
require('./db/mongoose')
const productRouter = require('./routes/productRoute')
const userRouter = require('./routes/userRoute.')



const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000


app.use(express.json())
app.use(cors());



// product router used by server
app.use(productRouter)
// user router used by server
app.use(userRouter)



app.listen(port, ()=>{
    console.log(`server listening on localhost : ${port}`)
})