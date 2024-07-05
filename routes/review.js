const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review= require("../models/review.js");
const Listing = require("../models/listing.js");
//validate reviews
const validateReview = (req, res, next) =>{
  let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
    else{
      next();
    }
}
//Reviews
router.post("/",wrapAsync(async(req,res)=>{
          let { id } = req.params;
          let listing= await Listing.findById(req.params.id);
          let newReview= new Review(req.body.review);
          listing.reviews.push(newReview);
          await newReview.save();
          await listing.save();
          console.log("New Review Saved");
          req.flash("Success","New Review Add :)");
          res.redirect(`/listings/${id}`);
        
        
        }));
 //DELETE REVIEW ROUTE
        router.delete("/:reviewId", wrapAsync(async (req, res)=>{
          let{id,reviewId}=req.params;
          await Review.findById(reviewId);
          await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
          req.flash("Success","Review Removed Successfully :)");
          res.redirect(`/listings/${id}`);
          
        }));
module.exports=router;