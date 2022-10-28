import jwt from 'jsonwebtoken'
import { userModel } from '../DB/models/user.js'
import { changeOfflineToOnLine } from '../modules/user/controller/user.js';

export const auth = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers; 
            if (!authorization?.startsWith(process.env.bearerToken)) {
                res.status(400).json({ message: "in-valid bearer key" })
            } else {
                const token = authorization.split(process.env.bearerToken)[1] 
                const decoded = jwt.verify(token, process.env.loginToken)
                console.log( {decoded} );
                console.log( {decodedID:decoded?.id} );
                if (!decoded?.id) {
                    res.status(400).json({ message: "invalid token playload" })
                } else { 
                    const user = await userModel.findOne({ _id: decoded.id, confirmEmail: true, isDeleted: false, isBlocked: false })
                    if (!user) {
                        res.status(400).json({ message: "invalid token user" })
                        // next(null)
                    } else {
                        req.user = user
                        // await changeOfflineToOnLine(user)
                        next()
                    }
                }

            }
        } catch (error) {

            res.status(500).json({ message: "catch error", error })
        }
    } 
}