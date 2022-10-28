import { userModel } from "../DB/models/user.js"
import { encryptPhone, hashPass } from "../modules/auth/controller/auth.js"

export const addFirstAdmin = async ()=>{
    try {
        const email = 'thana.najem13@gmail.com'
const password = "123456qwert$EE"
const role = "admin"
const firstName = "thana"
const lastName = "najem"
const gender = 'female'
const phone = '896541230'
const user = await userModel.findOne({email}).select('email')
if(!user){
    const hasPassword =await hashPass(password)
    const encruptPhone = encryptPhone(phone)
    // I cancel confirmation because manual creation
    const newAdmin = new userModel({email,password:hasPassword,role,firstName,lastName,gender,phone:encruptPhone,confirmEmail:true})
   const savedUser =  await newAdmin.save()
   if(savedUser){
       console.log(`admin saved: ${savedUser}`);
   }else{
    console.log(`fail to save admin`);
   }
}
else{
    console.log('admin exist o need to add him');
}
    } catch (error) {
       console.log(`catch error: ${error}`); 
    }

}