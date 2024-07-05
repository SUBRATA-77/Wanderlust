module.exports.isLoggedIn=(req,res,next)=>{
          if(!req.isAuthenticated())
                    {
                      req.flash("error",":( You must be logged in before Add anything");
                       return res.redirect("/login");
                    }
                    next();
        
}