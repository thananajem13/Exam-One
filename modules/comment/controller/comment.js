import { commentModel } from "../../../DB/models/Comment.js"
import { productModel } from '../../../DB/models/product.js'
import { decryptPhone } from "../../auth/controller/auth.js"

export const addComment = async (req, res) => {
    try {
        
    const { _id } = req.user
    console.log({"user from add comment":req.user});
    const { commentBody } = req.body
    const { productID } = req.params
    const product = await productModel.findOne({ _id: productID, isDeleted: false })
    if (!product) {
        res.status(400).json({ message: "invalid product id or deleted product, so you can't comment here" })
    }
    const comment = new commentModel({ commentBody, createdBy: _id, productId: productID })
    const savedComment = await comment.save()

    if (savedComment) {
        const commenttID = savedComment._id
        const updateCommentsProduct = await productModel.findByIdAndUpdate(
            { _id: productID },
            { $push: { comments: commenttID } }, { new: true }
        ).populate('comments likes')
        console.log({ likes: updateCommentsProduct?.likes });
        for (const like of updateCommentsProduct?.likes) {
            console.log({ like });
            like.phone = decryptPhone(like.phone)
        } 
        updateCommentsProduct ? res.status(200).json({ message: "Done", updateCommentsProduct }) : res.status(400).json({ message: "fail to add comment to it's product" })
    } else res.status(400).json({ message: "failedd to save comment" })
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
}
export const updateComment = async (req, res) => {
    try {
        const { _id } = req.user
    const { commentID } = req.params
    const { commentBody } = req.body
    const comment = await commentModel.findOne({ _id: commentID, createdBy: _id, isDeleted: false })
    if (!comment) {
        res.status(400).json({ message: "invalid comment id or you are not an owner of comment" })
    }
    const updateComment = await commentModel.findOneAndUpdate({ _id: commentID, createdBy: _id }, { commentBody }, { new: true })
    updateComment ? res.status(200).json({ message: "comment updated successfully", updateComment }) : res.status(400).json({ message: "fail to update" })
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
    
}
export const softDeleteComment = async (req, res) => {
    try {
        const { _id } = req.user
    console.log({user:req.user});
    const { commentID } = req.params
    
    const productOfComment = await productModel.findOne({ $and: [{ comments: { $in: [commentID] } }, { isDeleted: false }] }).populate({
        path: "comments",
        select:"commentBody createdBy productId",
        $match: { isDeleted: false }
    })
    console.log({productOfComment});
    if(!productOfComment){res.status(400).json({message:"invalid commentID ",productOfComment})}
    else{
         const productPublisher = productOfComment?.createdBy 
         const ownerComment = productOfComment?.comments[0]?.createdBy 
    if (_id.equals(productPublisher)  || _id.equals(ownerComment)) {
        const softDelComment = await commentModel.findOneAndUpdate({ _id: commentID,isDeleted:false }, { isDeleted: true }, { new: true }).populate('productId createdBy')
        softDelComment?res.status(200).json({message:"soft deleted done",softDelComment}):res.status(400).json({message:"this comment already deleted "})
    } else {
        res.status(400).json({ message: "you can't make a soft delete because you are neigher product owner nor comment owner" })
    }
    }
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
    
   
}