const express = require('express')
const authRouter = require('./routes/auth')
const agentRouter = require('./routes/agent')
const taskRouter = require('./routes/taks')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()
app.use(express.json())
app.use(cors())
app.use('/', authRouter)
app.use('/', agentRouter)
app.use('/', taskRouter)

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on PORT:${process.env.PORT}`)
})