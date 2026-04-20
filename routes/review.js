const express = require("express");
const router =  express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//post review route 
router.post("/",validateReview ,isLoggedIn,wrapAsync (reviewController.createReview));

//delete review route
router.delete("/:reviewID",isReviewAuthor, isLoggedIn , wrapAsync(reviewController.destroyReview));

module.exports = router;
