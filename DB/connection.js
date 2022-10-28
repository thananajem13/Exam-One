import mongoose  from "mongoose";
import { addFirstAdmin } from "../helper/admins.js";


const connectDB  =  async()=>{
    return await  mongoose.connect(process.env.DBURI)
    .then(res => {
        // addFirstAdmin()
        console.log(`Connected DB Success on  ${process.env.DBURI}`);
    }).catch(err=>console.log(`Fail to connectDB ${err}`))
}

export default connectDB