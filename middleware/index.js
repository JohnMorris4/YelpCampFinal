var Campground = require("../models/campground");
var Comment = require("../models/comment");

//include all middleware
var middlewareObj = {};
middlewareObj.checkUser = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
            } else {
            //Does the user own the campground
            if(foundCampground.author.id.equals(req.user._id)){
               next();
               //res.render("campgrounds/edit", {campground: foundCampground}); 
            } else {
              req.flash("error", "Permission Denied");
              res.redirect("back"); 
            }
        }
    });
    } else {
        req.flash("error", "Please log in first!");
        res.redirect("back");
    }
    
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.checkCommentOwner = function(req, res, next){
  if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            //Does the user own the comment
            if(foundComment.author.id.equals(req.user._id)){
                next();
               //res.render("campgrounds/edit", {campground: foundComment}); 
            } else {
              req.flash("error", "Please log in first!");
              res.redirect("back"); 
            }
        }
    });
    } else {
        req.flash("error", "Please log in first!");
        res.redirect("back");
    }  
};





module.exports = middlewareObj