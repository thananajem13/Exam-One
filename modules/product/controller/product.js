import { productModel } from "../../../DB/models/product.js"
import mongoose, { Types } from "mongoose"

export const addProduct = async (req, res) => {
    try {
        const { _id } = req.user
        const { title, description, price } = req.body
        const product = new productModel({ title, description, price, createdBy: _id })
        const savedProduct = await product.save()
        savedProduct ? res.status(201).json({ message: "Done", savedProduct }) : res.status(400).json({ message: "failed to save" })
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }


}
export const updateProduct = async (req, res) => {
    try {
        const { _id } = req.user
        const { productID } = req.params
        productID = mongoose.Types.ObjectId(productID)

        const { title, description, price } = req.body
        console.log({ title });
        const product = await productModel.findOne({ createdBy: _id, _id: productID, isDeleted: false })
        if (product) {
            const updateProduct = await productModel.findByIdAndUpdate({ _id: productID }, { title, description, price })
            updateProduct ? res.status(200).json({ message: "product updated successfully", updateProduct }) : res.status(400).json({ message: "fail to update" })
        } else {
            res.status(404).json({ message: "invalid productID or product deleted", product })
        }
    } catch (error) {
        res.status(500).json({ message: "catch  error", error })
    }



}
export const deleteProduct = async (req, res) => {
    try {
        const { _id } = req.user
        const { productID } = req.params
        const product = await productModel.findOne({
            _id: productID, createdBy: _id
        })//I don't make sure about is Deleted because this is not entire deleting
        console.log({ product });
        if (product) {
            const deletedProduct = await productModel.findOneAndDelete({ _id: productID, createdBy: _id })
            deletedProduct ? res.status(200).json({
                message: "product deleted successfully", deletedProduct
            }) : res.status(400).json({ message: "failed to delete" })
        } else {
            res.status(400).json({
                message: "invalid product id or your aren't the owner of this product"
            })
        }
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
   
}
 
export const softDeleteProduct = async (req, res) => {
    try {
        const { _id } = req.user
    const { productID } = req.params
    const product = await productModel.findOne({ _id: productID, createdBy: _id })
    if (!product) {
        res.status(400).json({ message: "invalid product id or you aren't the owner of this product" })
    } else {
        const softDeleteProduct = await productModel.updateOne({ _id: productID, createdBy: _id, isDeleted: false }, { isDeleted: true })
        softDeleteProduct ? res.status(200).json({ message: "produc deleted successfully", softDeleteProduct }) : res.status(400).json({ message: "fail to soft delete" })
    }
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
    
}
export const getProductByID = async (req, res) => {
    try {
        const { productID } = req.params
    const product = await productModel.findOne({ _id: productID, isDeleted: false })
    product ? res.status(200).json({ message: "done", product }) : res.status(400).json({ message: "invalid id", product })
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
    
}
export const likeProduct = async (req, res) => {
    try {
        const { _id } = req.user
    const { productID } = req.params
    const product = await productModel.findOne({ $and: [{ createdBy: { $ne: _id } }, { _id: productID }, { isDeleted: false }] })
    console.log(!product);
    if (!product) {
        res.status(400).json({ message: "invalid product id or you're owner of this product, so you can't like it or post is deleted" })
    } else { 
        const likess = await productModel.findOne({ $and: [{ likes: { $in: [_id] } }, { _id: productID }] })

        if (!likess) {
            const addLikeToPost = await productModel.findByIdAndUpdate(
                { _id: productID },
                { $push: { likes: _id } }, { new: true }
            );
            addLikeToPost ? res.status(201).json({ message: "Like added successfully", addLikeToPost }) : res.status(400).json({ message: "fail  to add like" })
        } else {
            res.status(400).json({ message: "You liked in this post before you can't like again" })
        }

    }
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
    
}
export const unLikeProduct = async (req, res) => {
    try {
        const { _id } = req.user
    const { productID } = req.params
    console.log({ id: _id, prodID: productID });
    const product = await productModel.findOne({ $and: [{ createdBy: _id }, { _id: productID }, { isDeleted: false }] })
    console.log({ product });
    if (product) {
        res.status(400).json({ message: "invalid product id or you're owner of this product, so you can't like it" })
    } else { 
        const likess = await productModel.findOne({ $and: [{ likes: { $in: [_id] } }, { _id: productID }] })

        if (likess) {
            const addLikeToPost = await productModel.findByIdAndUpdate(
                { _id: productID },
                { $pull: { likes: _id } }, { new: true }
            );
            addLikeToPost ? res.status(201).json({ message: "unLike added successfully", addLikeToPost }) : res.status(400).json({ message: "fail  to add like" })
        } else {
            res.status(400).json({ message: "You unliked a post before in this post so you can't unlike " })
        }

    }
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
    
}
export const productTitleSearch = async (req, res) => {
    try {
        const { title } = req.body
    console.log({ title2: new RegExp(title) });

    const product = await productModel.find({ $and: [{ title: new RegExp(title) }, { isDeleted: false }] })
    product.length ? res.status(200).json({ message: "done", product }) : res.status(404).json({ message: "data not found" })
    } catch (error) {
        res.status(500).json({message:"catch error"})
    }
    
}
export const getAllProductWithTheirComment = async (req, res) => {
    try {
        const products = await productModel.find({ isDeleted: false }).populate([{
        path: 'comments',
        $match: { isDeleted: false }
    }, {
        path: 'createdBy',
        $match: { isDeleted: false }
    }])

    products.length?res.status(200).json({message:"done",products}):res.status(404).json({message:"not found"})
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
    
}


