import app from "./app"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI!)
.then(()=>{
   console.log("MongoDB connected!")
   app.listen(PORT, () =>{
      console.log(`App is running on port ${PORT}`) 
   })

}).catch((error)=>{
   console.error(error)
})