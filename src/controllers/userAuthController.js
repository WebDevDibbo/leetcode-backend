const redisClient = require("../config/redis");
const User = require("../models/user")
const validateAuthFields = require('../utils/authValidator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerUser = async(req,res) => {

    try{

        // validator --> validate the data
        validateAuthFields(req.body); 
        const pass = req.body.password;
        req.body.password = await bcrypt.hash(pass, 10);
        req.body.role = "user";
        //email is already exist you dont have check that because you have already mention it in userSchema

        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id, role:user.role, emailId : user.emailId}, process.env.JWT_KEY, {expiresIn: 60*60});
        
        res.cookie('token',token, {maxAge : 60*60*1000});
        res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send(`Error : ${err.message}`);
    }
}

const loginUser = async(req,res)=> {

    try{

        const {emailId, password} = req.body;

        if(!emailId || !password) 
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId});

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
            throw new Error("Invalid Credentials");

        const token = jwt.sign({_id:user._id, role: user.role, emailId : user.emailId}, process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('token',token, {maxAge : 60*60*1000});
        res.status(200).send("Logged In Successfully");

    }
    catch(err){
        res.status(401).send(`Error : ${err.message}`);
    }
}


const logoutUser = async(req,res) => {

    try{

        //validate the token
        console.log(req);
        const {token} = req.cookies;

        const payload = jwt.decode(token);

        //we will add the token to redis blocklist

        await redisClient.set(`token:${token}`,"Blocked");
        await redisClient.expireAt(`token:${token}`,payload.exp);

        // we will clear the cookies
        res.cookie("token", null, {expires : new Date(Date.now())});
        res.send("Logged Out Successfully");

    }
    catch(err){
        res.status(503).send(`Error : ${err.message}`);
    }
}


const adminRegister = async(req,res)=>{


    try{

        // validator --> validate the data
        //*{{ you can avoid adminmiddleware instead of usermiddleware you just have to check
        //    if(req.result.role !== 'admin')
        //      throw new Error("Invalide token")  
        validateAuthFields(req.body); 
        const pass = req.body.password;
        req.body.password = await bcrypt.hash(pass, 10);
        req.body.role = "admin";
        //email is already exist you dont have check that because you have already mention it in userSchema

        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id, role:"admin", emailId : user.emailId}, process.env.JWT_KEY, {expiresIn: 60*60});
        
        res.cookie('token',token, {maxAge : 60*60*1000});
        res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send(`Error : ${err.message}`);
    }

}

module.exports = {registerUser, loginUser, logoutUser, adminRegister};