const express = require("express");
const router= express();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const listings=require("../routes/listing.js");
const Listing = require("../models/listing.js");
const {isLoggedIn}=require("../middle_ware.js");
//Validate Listings
const validateListing = (req, res, next) =>{
          let {error} = listingSchema.validate(req.body);
            if(error){
              let errMsg = error.details.map((el) => el.message).join(",");
              throw new ExpressError(400, errMsg);
            }
            else{
              next();
            }
        }
//Index route
router.get("/",wrapAsync(async(req,res)=>{
          const all_listings=  await Listing.find({});
         res.render("./listings/shows.ejs",{all_listings});
       })
   );
//New Route
router.get("/new",isLoggedIn,wrapAsync(async(req,res)=>{
          //console.log(req.user);
         
         
          res.render("./listings/new.ejs");
         })
        );
//Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
          let {id}=req.params;
          const listing=await Listing.findById(id);
          if(!listing)
            {
              req.flash("error","Listing you requested for doesn't exists :(");
              res.redirect("/listings");
            }
          res.render("listings/edit.ejs",{listing});
        })
        );


//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
          let {id}=req.params;
          const listing=await Listing.findById(id).populate("reviews");
          if(!listing)
            {
              req.flash("error","Listing you requested for doesn't exists :(");
              res.redirect("/listings");
            }
          res.render("./listings/show.ejs",{listing});
        })
        );

//Create Route
router.post("/",isLoggedIn,wrapAsync(async(req,res,next)=>{
          // const lis=req.body;
            const new_li=new Listing(req.body.listing);
            await new_li.save();
            req.flash("Success","New Listing Created");
           res.redirect("/listings");
          
          
        })
        );

//Update Route
router.put("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
          if(!req.body.listing)
            {
              throw new ExpressError(400,"Bad request");
            }
          let { id } = req.params;
          await Listing.findByIdAndUpdate(id, { ...req.body.listing });
          req.flash("Success"," Listing Updated :)");
          res.redirect(`/listings/${id}`);
        
        })
        );
//DELETE Route
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
          let { id } = req.params;
          let deletedListing = await Listing.findByIdAndDelete(id);
          console.log(deletedListing);
          req.flash("Success"," Listing Deleted");
          res.redirect("/listings");
        })
        );
       

        module.exports=router;