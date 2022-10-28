import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import connectDB from './DB/connection.js'
import { addFirstAdmin } from './helper/admins.js'
import * as indexRouter from './modules/index.router.js' 

const app = express()

const port = 3000

const baseURL = process.env.BASEURL

app.use(express.json()) 
connectDB()
addFirstAdmin() 
app.use(`${baseURL}/user`, indexRouter.userRouter)

app.use(`${baseURL}/auth`,indexRouter.authRouter)
app.use(`${baseURL}/product`,indexRouter.productRouter)
app.use(`${baseURL}/comment`,indexRouter.commentRouter)



app.use("*",(req,res)=>{
    res.status(404).json({message:"404 NotFound page"})
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))