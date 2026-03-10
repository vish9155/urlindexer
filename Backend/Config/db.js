import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

let dbConect=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("_____________Db Connected______________")
    } catch (error) {
        console.log("___________Db Not Connected______________",error)
    }
}

export default dbConect