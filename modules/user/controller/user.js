import { userModel } from "../../../DB/models/user.js"
import { decryptPhone, encryptPhone, hashPass } from "../../auth/controller/auth.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { productModel } from "../../../DB/models/product.js"
import { commentModel } from "../../../DB/models/Comment.js"
export const changeOnlineToOffLine = (user) => {
    const timeNow = moment().format('MMMM Do YYYY, h:mm:ss a')

    return userModel.findByIdAndUpdate({ _id: user._id, isOnline: true }, { isOnline: false ,lastSeen:timeNow},{new:true})
}
export const changeOfflineToOnLine = (user) => {
    return userModel.findByIdAndUpdate({ _id: user._id, isOnline: false }, { isOnline: true ,lastSeen:null},{new:true})
}

export const updateProfile = async (req, res) => {
    let updateUser = {}
    try {
        const { _id } = req.user
        let { phone, password, email, firstName, lastName, address, age, gender } = req.body

        if (email) {
            const user = await userModel.findOne({ $and: [{ email }, { _id: { $ne: _id } }] }).select('email')

            if (user) {
                res.status(409).json({ message: "email exist" })
            }
            updateUser.email = email

        }
        if (phone) {
            phone = encryptPhone(phone)
            updateUser.phone = phone
        }
        if (password) {
            password = await hashPass(password)
            updateUser.password = password
        }
        if (firstName) {
            updateUser.firstName = firstName
        }
        if (lastName) {
            updateUser.lastName = lastName
        }
        if (address) {
            updateUser.address = address
        }
        if (age) {
            updateUser.age = age
        }
        if (gender) {
            updateUser.gender = gender
        }
        const user = await userModel.findByIdAndUpdate({ _id }, updateUser, { new: true }) 
        user.phone = decryptPhone(user.phone)
        user ? res.status(200).json({ message: "done", user }) : res.status(400).json({ message: "in-valid id", user }) 



    } catch (error) {
        if (error.name === 'JsonTokenExpired') {
            await changeOnlineToOffLine(req.user)
        }
        res.status(500).json({ message: "catch error", error })
    }
}
 
export const updatePassword = async (req, res) => {
    try {
        const { _id } = req.user
        const { password, oldPass } = req.body
        const match = await bcrypt.compare(oldPass, req.user.password)
        if (match) {
            const hashPassword = await hashPass(password)
            const user = await userModel.findByIdAndUpdate({ _id }, { password: hashPassword })
            user.phone = decryptPhone(user.phone)
            user ? res.status(200).json({ message: "password updated successfully", user }) : res.json({ message: "invalid id" })
        } else {
            res.status(400).json({ message: "old password mismatch with actully old password" })
        }

    } catch (error) {
        if (error.name === 'JsonTokenExpired') {
            await changeOnlineToOffLine(req.user)
        }
        res.status(500).json({ message: "catch error", error })
    }

}
export const checkNumOfAdminExpcetLoggedNow = async (loggedAdminID) => {
    try {
        const adminsCount = await userModel.find({ role: "admin", _id: { $ne: loggedAdminID } }) 
        return adminsCount.count()
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }

}
export const softDeleteProfile = async (req, res) => {
    try {
        const { _id, role } = req.user 
        const adminsCount = await userModel.find({ role: "admin", _id: { $ne: _id } }).count()

        // I dont check if isDeleted:false because I check it in auth middleware
        if ((role == 'admin' && adminsCount > 0) || (role == "user")) {
            const softDel = await userModel.findByIdAndUpdate(_id, { isDeleted: true })
            softDel ? res.status(200).json({ message: "Done, if you need to control on your profile please loginin again" }) : res.status(400).json({ message: "invalid id or an error occure at deleted part" })
            jwt.sign({ _id }, process.env.loginToken, { expiresIn: 0 })
        } else if (role == 'admin' && adminsCount == 0) {
            res.status(409).json({ message: "website will be with no admins so set any user to be admin" })
        } 
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const { _id } = req.user
        const isAdmin = userModel.findOne({ _id, role: "admin" })
        if (isAdmin) {
            next()
        } else {
            res.status(403).json({ message: "forbidden" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }

}
export const blockAccount = async (req, res) => {
    try {
        const { id } = req.body
        const blockedAccount = await userModel.findOne({ _id: id, isBlocked: false, role: "user" }
        ) 
        if (blockedAccount) {
            if (blockAccount._id !== req.user._id) {
                const updatedUser = await userModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true })
                updatedUser ? res.status(200).json({ message: "user updated successfully", updatedUser }) : res.status(400).json({ message: "fail to update maybe " })
            } else {
                res.status(403).json({ message: "you can't blockedd your self" })
            }
        } else {
            res.status(400).json({ message: "this user maybe blocked or invalid id or has an admin role or your account" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }

}
export const logout = async (req, res) => {
    try { 
        const { _id } = req.user
        const user = await userModel.findById({_id})
        if(user.isOnline){
            const logoutUserUpdate =   await changeOnlineToOffLine(req.user)
      logoutUserUpdate ? res.status(200).json({ lastSeen: logoutUserUpdate?.lastSeen, message: "success to logout you can login again" }) : res.status(400).json({ message: "fail to update" })
        
         jwt.sign({ id: _id, loggedIn: false }, process.env.loginToken, { expiresIn: 0 })
        }else{
            res.status(500).json({ message: "You're actully logout" }) 

        }
        
        
    } catch (error) {
        if (error?.name == "TokenExpiredError") {
            res.status(500).json({ message: "You're actully logout" }) 

        }
        else {
            res.status(500).json({ message: "catch error", error })
        }
    }

}








export const getAllUsers = async (req, res) => {
    try {
        let productsOfUser = []
        let users = await userModel.find()
        let products = await productModel.find();
        let commentsProducts = products?.comments
        let describedComment = await commentModel.find()  
        let commentsOfProducts = []

        for (const user of users) {
            user.phone = decryptPhone(user.phone)
            productsOfUser = []
            for (const product of products) {

                if (user._id.equals(product.createdBy)) { 
                    for (const productComment of product.comments) {
                        for (const comment of describedComment) {
                            if (productComment._id.equals(comment._id)) {
                                commentsOfProducts.push(comment)
                            }

                        }

                    }
                    product.commentss = commentsOfProducts
                    productsOfUser.push(product)
                }
            }
            user.products = productsOfUser 
        }
        const popUsers = users
        res.json({ message: "success", popUsers })

    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }




}
