import mongoose ,{Types}from 'mongoose'
import { commentSchema } from './Comment.js'
export const productSchema = new mongoose.Schema({
 title:{
    type:String,
    required:true

 },
 description:{
    type:String,
    required:true
 },
 price:{
    type:Types.Decimal128,
    required:true
 },
 createdBy:{
    type:Types.ObjectId,
    ref:'User',
    required:true
 },
 likes:[{
    type:Types.ObjectId,
    ref:'User'
 }],
 
 comments:[{
    type:Types.ObjectId,
    ref:'Comment'
 }],
 commentss:[commentSchema],
 isDeleted:{
    type:Boolean,
    default:false
 }
 


},{
    timestamps:true
})
export const productModel = mongoose.model('Product',productSchema) 