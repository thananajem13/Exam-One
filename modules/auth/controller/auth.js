import { userModel } from "../../../DB/models/user.js"
import bcrypt from 'bcryptjs'
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
import { myEmail } from "../../../services/email.js"
import { nanoid } from "nanoid" 
import { changeOfflineToOnLine } from "../../user/controller/user.js"
export const encryptPhone = (phone) => {
    try {
        // Encrypt
        const encryptedPhoneNumber = CryptoJS.AES.encrypt(phone, process.env.encryptKeySecure).toString();
        return encryptedPhoneNumber
    } catch (error) {
        console.log("catch error");

    }



}
export const decryptPhone = (encryptedPhoneNumber) => {
    try {
        // Decrypt
        const bytes = CryptoJS.AES.decrypt(encryptedPhoneNumber, process.env.encryptKeySecure);
        const decryptedPhoneNumber = bytes.toString(CryptoJS.enc.Utf8);

        console.log(decryptedPhoneNumber);
        return decryptedPhoneNumber
    } catch (error) {
        console.log("catch error");

    }

}
export const hashPass = (pass, saltRound = parseInt(process.env.SaltRound)) => {
    return bcrypt.hash(pass, saltRound)

}
export const SignUp = async (req, res) => {

    try {

        const { firstName, lastName, email, password, phone, age, address, gender } = req.body

        const user = await userModel.findOne({ email }).select('email')

        if (user) {
            res.status(409).json({ message: "email exist" })
        } else {

            const hashPassword = await hashPass(password, parseInt(process.env.SaltRound))

            const encryptPhoneNumber = encryptPhone(phone)
            const user = new userModel({ firstName, lastName, email, password: hashPassword, phone: encryptPhoneNumber, age, address, gender })
            const savedUser = await user.save()
            if (savedUser) {
                const token = jwt.sign({ id: savedUser._id }, process.env.emailToken,
                    { expiresIn: 3 * 60 })

                const rfToken = jwt.sign({ id: savedUser._id }, process.env.emailToken,)
                const link =
                    `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
                const linkrf =
                    `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refToken/${rfToken}`

                myEmail(email,
                    'ConfirmationEmail',
                    `<a href='${link}'>Follow me to confirm u account</a> <br>
                         <a href='${linkrf}'>Re-send confirmation email</a>`)

                res.status(201).json({ message: "Done", user })
            } else {

                res.status(400).json({ message: "failed to signup" })
            }




        }

    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }
}

export const refTokenEmail = async (req, res) => {
    try {
        const { token } = req.params;


        const decoded = jwt.verify(token, process.env.emailToken)
        if (!decoded?.id) {
            res.status(400).json({ message: "in-valid token payload" })
        } else {
            const user = await userModel.findById(decoded.id).select('email confirmEmail')
            if (!user) {
                res.status(400).json({ message: "not register account" })
            } else {
                if (user.confirmEmail) {
                    res.status(409).json({ message: "Already confirmed" })
                } else {
                    const token = jwt.sign({ id: user._id }, process.env.emailToken,
                        { expiresIn: 60 * 5 })
                    const link =
                        `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`

                    myEmail(user.email,
                        'ConfirmationEmail',
                        `<a href='${link}'>Follow me to confirm u account</a> `)
                    res.json({ message: "Done" })
                }
            }
        }


    } catch (error) {
        res.status(500).json({ message: "error", error })
    }


}
export const refToken = async (req, res) => {
    try {
        const { token } = req.params;


        const decoded = jwt.verify(token, process.env.emailToken)
        if (!decoded?.id) {
            res.status(400).json({ message: "in-valid token payload" })
        } else {
            const user = await userModel.findOne({_id:decoded.id,confirmEmail:true,isDeleted:false,isBlocked:false}).select('email confirmEmail')
            if (!user) {
                res.status(400).json({ message: "not register account" })
            } else {
                // if (user.confirmEmail) {
                //     res.status(409).json({ message: "Already confirmed" })
                // } else {
                    const token = jwt.sign({ id: user._id }, process.env.loginToken,
                        { expiresIn: '30d' })
                    

                    
                    res.json({ message: "Done" ,refreshToken:token})
                // }
            }
        }


    } catch (error) {
        res.status(500).json({ message: "error", error })
    }


}
export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params
        if (!token) {
            res.status(400).json({ message: "in-valid token" })
        } else {
            const decoded = jwt.verify(token, process.env.emailToken)
            if (!decoded?.id) {
                res.status(400).json({ message: "in-valid token payload" })
            } else {
                const user = await userModel.updateOne({
                    _id: decoded.id,
                    confirmEmail: false
                },
                    { confirmEmail: true })
                user.modifiedCount ? res.status(200).json({ message: "Done please proceed to login page" }) :
                    res.status(400).json({ message: " Already confirmed" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error })

    }

}
export const SignIn = async (req, res) => {

    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email, isBlocked: false,isDeleted:false, confirmEmail: true })
        // const user = await userModel.findOne({ email, isDeleted: false, isBlocked: false, confirmEmail: true })
        if (!user) {
            res.status(400).json({ message: "invalid email or deleted or blocked or unconfirmed account" })
        } else {
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                res.status(400).json({ message: "invalid account" })
            } else {
                const token = jwt.sign({ id: user._id, loggedIn: true }, process.env.loginToken, { expiresIn: '1h' })
                const rfToken = jwt.sign({ id: user._id, loggedIn: true }, process.env.loginToken)//by this way or navigate refresh token router
                // const rfToken = jwt.sign({ id: user._id, loggedIn: true }, process.env.emailToken)
                res.cookie('rfToken',rfToken)
                res.cookie('token',token)

                await changeOfflineToOnLine(user)

                // const updateOnlineStatus = await userModel.updateOne({ _id: user._id }, { online: true,lastSeen:null })
                res.status(200).json({ message: "Done", token, rfToken })
            }

        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }

}
export const getUserByID = async (req, res) => {
    try {
         const { id } = req.params

    const user = await userModel.findOne({ _id: id, isDeleted: false, isBlocked: false, confirmEmail: true })
    // console.log(`user:: ${user}`);
    if (user) {
        user.phone = decryptPhone(user.phone)
        res.status(200).json({ message: "done", user })
    }
    else {
        res.status(400).json({ message: "in-valid id or deleted or blocked or unconfirmed account " })
    }
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
   
}

 




export const sendLink = async (req, res) => {
try {
    const { email } = req.body;
    const user = await userModel.findOne({ email, isDeleted: false,
        confirmEmail:true, isBlocked: false }).select('email')
    if (!user) {
        res.json({ message: "In-valid Account" })
    } else {
        const code = nanoid()
        const genreateToken = jwt.sign({ id: user._id, code }, process.env.resetToken, { expiresIn: '10m' })
        // const token = new tokenModel({ token: genreateToken, userID: user._id })
        // token.save()
        await userModel.updateOne({ email }, { code })//extra step
        const resetPassword =
            `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/resetPass/${genreateToken}`
            // `activatedCode: ${code}<br>` 

        myEmail(email,
            'reset password',
            `
               <a href='${resetPassword}'>Follow me to reset u password by click here to get code to use it in reset password</a> <br>
             `)
        res.status(200).json({ message: "check email inbox to reset password link" })
    }
} catch (error) {
    res.status(500).json({message:"catch error",error})
}
    
}
export const resetPass = async (req, res) => {
    try {
         const { token } = req.params
    const decoded = jwt.verify(token, process.env.resetToken)
    // console.log(`decoded?.id:${decoded?.id}`);
    if (decoded?.id) {
        res.status(200).json({message:`Done set this code in your request {code : ${decoded.code}}`})
        // const isActiveToken = await tokenModel.findOne({ token, userID: decoded.id, isDeleted: false })
        // await userModel.updateOne({ _id:decoded.id }, { code:null })
        // console.log({isActiveToken});
        // if(isActiveToken){
            // await tokenModel.updateOne({ _id: decoded.id, token: token }, { isDeleted: true })
            // console.log("before: ",req.method);
            // req.method = 'POST'
            // res.redirect(302,`/postResetpass`);  
            // res.redirect(307,`/postResetpass`);  
        // var fullUrl = req.originalUrl.split('/api/v1/')[1]; 
        // console.log({fullUrl});
        // req.originalUrl.replace("/"+fullUrl+"/gi", "auth/postResetpass")
        // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        // console.log({"originalUrl":req.originalUrl,fullUrl});

        //     console.log("after: ",req.method); 
            // res.json('redirectto post pass')
        // }else{
        //     res.status(400).json(`send another link to email.. click here: <a href="/forgetPass">forget password</a>`)
        //     // or
        //     // res.redirect('/forgetPass')
        // }
    const Token = jwt.sign(decoded, process.env.resetToken,{expiresIn:0})}
     else {
        res.status(400).json({ message: "invalid token, you can't use this url again you should send another email to set your forget pass" })
    }
    
    } catch (error) { 
            res.status(500).json({message:'catch error',error})
                        // res.redirect('/forgetPass')
 
    }
   






}
export const postResetpass = async (req, res) => {
    try {
        // const { token } = req.params
    const { email, newPassword ,code} = req.body

    // const decoded = jwt.verify(token, process.env.resetToken)
    // if (decoded?.id) {
        if(code==null){
            res.status(400).json({message:"not accepted as null"})
        }else{
             const checkIfThisIDHaveThisEmail = userModel.findOne({email,code })
        if (checkIfThisIDHaveThisEmail) {
            const hashPassword = await hashPass(newPassword)
            const user = await userModel.updateOne({ email },
                { password: hashPassword, code: null })
            user.modifiedCount ? res.status(200).json({ message: "Done" }) :
                res.status(400).json({ message: "In-valid code" })
        } else {
            res.status(400).json({ message: "invalid token or account" })
        }
        }
       

    // }else{
    //     res.redirect('/forgetPass')
    // }
    } catch (error) {
        res.status(500).json({message:"catch error",error})
        // console.log("hhhhhhhhh");
        // if (error.name === 'JsonTokenExpired') {
// console.log(error);
// req.method='GET'
//         res.redirect(307,`${process.env.BASEURL}/auth/forgetPass`)
//         var fullUrl = req.originalUrl.split('/api/v1/')[1]; 
//         req.originalUrl.replace(fullUrl, "auth/forgetPass")
//         console.log({"test":req.originalUrl});
        // res.redirect(307,'/forgetPass')
    // }
    }
    
    // if (code == null) {
    //     res.status(400).json({ message: "In-valid code because null not accepted" })
    // } else {
    //     const hashPassword = await hashPass(newPassword)
    //     const user = await userModel.updateOne({ email, code },
    //         { password: hashPassword, code: null })
    //     user.modifiedCount ? res.json({ message: "Done" }) :
    //         res.json({ message: "In-valid code" })
    // }
}