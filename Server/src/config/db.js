const mongoose = require("mongoose")
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
    } catch(err) {
        console.log("error connection to DB\n"+err)
    }
}
module.exports = connectDB