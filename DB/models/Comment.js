import mongoose ,{Types}from 'mongoose'
export const commentSchema = new mongoose.Schema( {
    commentBody:{
        type:String,
        required:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User'
    },
    productId:{
        type:Types.ObjectId,
        ref:"Product"
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedBy:{
        type:Types.ObjectId,
        ref:'User'
    } 
},{
    timestamps:true
})
export const commentModel = mongoose.model('Comment',commentSchema) 