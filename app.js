let express = require("express");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let methodOverride = require("method-override");

let app = express();

//APP CONFIG
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

//MONGOOSE CONFIG
mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true, useUnifiedTopology: true });

let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: ({type: Date, default: Date.now()})
});
let Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
//     body: "Lorem Ipsum Whetever"
// });

//RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR")
        }
        else{
            res.render("index", {blogs: blogs})
        }
    });
});
//NEW ROUTE

app.get("/blogs/new", function(req, res){
    res.render("new");
})

//CREATE ROUTE
//As the form in new.ejs has action to /blogs, we need to create in /blogs
app.post("/blogs", function(req,res){
    Blog.create(req.body.blog, function(err,newBlog){ //Body Parser: blog[title],[image],[body]
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs")
        }
    })
})

//SHOW ROUTES
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show", {blog: foundBlog})
        }
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit", {blog: foundBlog})
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/");
      }
      else{
          res.redirect("/blogs/"+ req.params.id);
      }
  })
})

//DELETE ROUTE
app.delete("/blogs/:id",function(req, res){
    //Delete a Post
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
})
app.listen("5000", function(){
    console.log("Listening at port 5000");
})