var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
app = express();

mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({

    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// Restful Routs ////////////////////////////////////////////////////////////

// INDEX ROUTS DONE

app.get("/", function(req, res) {
    res.redirect("/blogs");
});


app.get("/blogs", function(req, res) {

    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log("An Error has occured");
        } else {
            res.render("index", { blogs: blogs });
        }
    });

});


// NEW ROUTE {SHOW ALL NEW ROUTes}
// CREATE ROUTE
app.get("/blogs/new", function(req, res) {

    res.render("new");
});

app.post("/blogs", function(req, res) {
    console.log(req.body);
    console.log("===============");
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});


// Show a particular page

app.get("/blogs/:id", function(req, res) {

    Blog.findById(req.params.id, function(err, foundBLog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBLog });
        }

    });
});

// Edit route

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }

    });

});


// update route


app.put("/blogs/:id", function(req, res) {

    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/req.params.id");
        }

    });
});


// Delete route


app.delete("/blogs/:id", function(req, res) {
    // res.send("You have destroyed it");
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/blogs/req.params.id");
        } else {
            res.redirect("/blogs");
        }
    });
});


app.listen(3000, function() {
    console.log("Server started at port 3000");
});