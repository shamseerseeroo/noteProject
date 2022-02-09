require("dotenv").config();
const express = require('express');
const userRoutes = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt')
const saltRounds = 10;


userRoutes.post("/signup", function (req, res) {
    

    let name = req.body.userName
    let email = req.body.userEmail

    console.log(name, email, req.body.password)

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        const user = new userModel({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userPassword: hash
        })
        user.save(function (err) {
            if (err) {
                console.log(err)
            } else {
                res.json("signup successfully user")
            }
        })
    });



});
userRoutes.post("/login",function(req,res){
    let nameUser =req.body.name
    let passWord =req.body.password
     userModel.findOne({userName:nameUser},function(err,foundUser){
        
        if(err){
            console.log(err)
            
            }else{
                if(foundUser){
                    bcrypt.compare(passWord, foundUser.userPassword, function(err, result) {
                        // result == true
                        if(result === true){
                            const token = jwt.sign(
                                { user_id:foundUser._id ,name:foundUser.name},
                                process.env.TOKEN_KEY,
                                {
                                  expiresIn: "2h",
                                }
                              );
                              // save user token
                              
                            res.status("200").json({
                                message:"login successful",
                                token:token
                            })
                        }else{
                            console.log("password error")
                        }
                    });
                      
                    
                }else{
                    console.log("found user error")
                }
            }
        
    });
});
module.exports = userRoutes;