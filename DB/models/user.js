import mongoose ,{Types} from 'mongoose'
import { commentSchema } from './Comment.js'
import { productSchema } from './product.js'
const userSchema = new mongoose.Schema({
firstName:{
    type:String,
    required:true
},
lastName:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique: true
},
password:{
    type:String,
    required:true
},
 
phone:{
    type:String,
    required:true
},
age:{
    type:Types.Decimal128,
    // required:true
},
address:{
type:String//or id of address model
},
gender:{ 
    type: String, 
    enum: ['male', 'female'], 
    default: "male" 
},
confirmEmail:{
    type:Boolean,
    default:false
},
isDeleted:{
    type:Boolean,
    default:false
},
code:{ 
    type: String, default: null 
},
isBlocked:{
    type:Boolean,
    default:false
},
isOnline:{
    type:Boolean,
    default:false
},
lastSeen:{ 
    type: String, default: null 
},
role:{  
    type: String, 
    enum: ['user', 'admin'], 
    default: "user" 
},
code:{
    type:String,
    default:null
}, 
products:[productSchema], 
 


},{
    timestamps:true
})
export const userModel = mongoose.model('User',userSchema) 