const express = require("express");
const User=require("../models/user.js");
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");

const router = express.Router();
router.get("/signup",(req,res)=>{
      res.render("users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{
      try{
       let{username,email,password}=req.body;
       const new_user=new User({email,username});
       const registered_user=  await User.register(new_user,password);
       console.log(registered_user);
       req.login(registered_user,(err)=>{
            if(err)
                  { 
                     return next(err);
                  }
                  req.flash("Success","You are now Logged In");
                  res.redirect("/listings");
      })
      }
      catch(e){
            req.flash("error",err.message);
            res.redirect("/signup");

      }
         

})
);
router.get("/login",(req,res)=>{
      res.render("users/login.ejs");
});
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
      req.flash("success","Welcome back");
      res.redirect("/listings");


});
router.get("/logout",(req,res)=>{
      req.logout((err)=>{
            if(err)
                  { 
                     return next(err);
                  }
                  req.flash("Success","Okay You are now Logged Out");
                  res.redirect("/listings");
      });
});
module.exports=router;