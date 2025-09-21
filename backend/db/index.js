const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

mongoose.connect(process.env.MONGO_URL);
const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

 const agentSchema = new mongoose.Schema({
    name: String,
    email: String,
    fullNumber: String,
    password: String,
 })

 const distributedListSchema = new mongoose.Schema({
   agentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true},
   items: [
      {
         FirstName: String,
         Phone: Number,
         Notes: String
      }
   ]
 })

 const Admin = mongoose.model('Admin', adminSchema)
 const Agent = mongoose.model('Agent', agentSchema)
 const DistributedList = mongoose.model('DistributedList', distributedListSchema)

 module.exports = {
    Admin,
    Agent,
    DistributedList
 }