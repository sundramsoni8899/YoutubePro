import dns from "dns";

dns.setServers(["8.8.8.8","8.8.4.4"])

import mongoose from "mongoose";

import {DB_NAME} from "../constants.js"

const connectDB = async ()=>{

    //  console.log("--- 🕵️‍♂️ DATABASE DEBUG PANEL ---");
    // console.log("Your MONGODB_URI is:", process.env.MONGODB_URI);
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\n MongoDB connected: ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
    }
}

export default connectDB


// import dns from "dns";

// dns.setServers(["8.8.8.8","8.8.4.4"]);


// import mongoose from "mongoose";


// import { DB_NAME } from "../constants.js";

// const connectDB = async ()=>{
//     try {
//         const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
//     } catch (error) {
//         console.log("MONGODB connection error ", error);
//         process.exit(1)
        
        
//     }
// }

// export default connectDB


