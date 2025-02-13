import { comparePassword, hashPassword } from '../helpers/authHelper.js'
import userModel from '../models/userModel.js'
import JWT from 'jsonwebtoken'
export const registerController= async (req,res)=>{
    try {
       const {name,email,password,phone,role,question} =req.body
       if(!name){
        return res.send({message:"Name is required"})
       }
       if(!email){
        return res.send({message:"email is required"})
       }
       if(!password){
        return res.send({message:"password is required"})
       }
       if(!phone){
        return res.send({message:"Phoneno is required"})
       }
       if(!phone){
        return res.send({message:"Answer is required"})
       }
      
       //check user
       const existinguser=await userModel.findOne({email})
       if(existinguser){
        return res.status(200).send({
            success:false,
            message:"allready register please login"
        })
       }
       //register user
       const hashedPassword=await hashPassword(password)
       const user= await new userModel({name,email,password:hashedPassword,phone,role,question}).save()
       res.status(201).send({
        success: true,
        message: "User registered successfully",
        user
    });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error to registration",
            error
        })
    }
 }
 export const loginController= async(req,res)=>{
    try {
        const {email,password}=req.body
        //validation
        if(!email|| !password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password"
            })
        }
        //check user
        const user=await userModel.findOne({email})
        if(!user)
            return res.status(404).send({
        success:"false",
    message:"Email is not registered"})
        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:"false",
                message:"Invalid Password"
            })
           

        }
         //token
         const token =await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d',})
         res.status(200).send({
            success:"true",
            message:"LOgin successfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                role:user.role
            },
            token,
         })
    } catch (error) {
       console.log(error)
       res.status(500).send({
        success:"false",
        message:"Invalid email or password"
       }) 
    }

 }
 //forgotPassword Controller
 export const forgotPasswordController = async (req, res) => {
    try {
        const { email, question, newPassword } = req.body;

        if (!email) {
            return res.status(400).send({ message: 'Email is required' });
        }
        if (!question) {
            return res.status(400).send({ message: 'Security question answer is required' });
        }
        if (!newPassword) {
            return res.status(400).send({ message: 'New password is required' });
        }

        // Check user with email and security question
        const user = await userModel.findOne({ email, question });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or security question',
            });
        }

        // Hash new password and update it
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });

        res.status(200).send({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error,
        });
    }
};

 //
 export const testController = (req, res) => {
    res.status(200).json({ message: 'Protected Route' });
};
