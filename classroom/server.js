const express=require("express");
const app=express();
const  session=require("express-session");
const flash=require("connect-flash");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join("views"));
const session_options=session(
          {secret:"mysupersecretstring",
          resave:false,
          saveUninitialized:true
}
);

app.use(session_options);
app.use(flash());
app.use((req,res,next)=>{
        res.locals.success_messages=req.flash("Success");
        res.locals.error_messages=req.flash("error");
        next();
});
app.get("/register",(req,res)=>{
          let{name="anonymous"}=req.query;
         
          req.session.name=name;
          console.log(req.session.name);
         
          if(name==="anonymous")
                {
                        req.flash("error","User not registered !!!");

                }
                else
                {
                        req.flash("Success","User registered successfully");
                }
         
          res.redirect("/hello");
});
app.get("/hello",(req,res)=>{
       
        res.render("page.ejs",{name:req.session.name});
})
// app.get("/test",(req,res)=>{
//           res.send("Response Was sent from server");
// });
// app.get("/reqcount",(req,res)=>{
//           if(req.session.count)
//                     {
//                               req.session.count++;
//                     }
//           else{
//                     req.session.count=1;
//           }
        
//           res.send(`You sent a request ${req.session.count} times`);
// })



app.listen(8080,()=>{
          console.log("App is listening to port 8080");
})