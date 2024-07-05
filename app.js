const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path=require("path");
const ejs_mate=require("ejs-mate");
const methodOverride=require("method-override");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStragy=require("passport-local");
const User=require("./models/user.js");
app.set("view engine","ejs");
app.set("views",path.join("views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', ejs_mate);
const listingsRouter=require("./routes/listing.js");
const ReviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const { copyFileSync } = require("fs");
const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*3600*1000,
    maxAge:7*24*60*3600*1000,
    httpOnly:true

  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStragy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//const path = require("path");
//const methodOverride = require("method-override");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
app.get("/", (req, res) => {
         
          res.send("Hi, I am root");
        });
app.use((req,res,next)=>
{
   res.locals.Success=req.flash("Success");
   res.locals.error=req.flash("error");
   res.locals.currUser=req.user;
   console.log(res.locals.Success);
   next();
});

app.use("/listings/:id/reviews",ReviewsRouter);
app.use("/listings",listingsRouter);
app.use("/",userRouter)
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found !!"));
});
app.use((err,req,res,next)=>{
  let{status=500,message="Some Error Occured"}=err;
   res.status(status).render("error.ejs",{message});
  //res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});




















// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

// const wrapAsync=require("./utils/wrapAsync.js");
// const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review= require("./models/review.js");

// app.get("/demouser",async(req,res)=>{
//   let fakeuser=new User({
//     email:"fakeemail@gmail.com",
//     username:"I am a fake User"
//   })
//   let registeredUser= await User.register(fakeuser,"heyHowAreYou");
//   res.send(registeredUser);
// });
