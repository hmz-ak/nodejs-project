var express=require("express");
var app=express();
var parser=require("body-parser");
var Post=require("./models/post");
var mongoose=require("mongoose");
app.use(parser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/portfolio_db",{useNewUrlParser: true,useUnifiedTopology: true});

//Index route
app.get("/",function(req,res){
    Post.find({},function(err,body){
        if(err){
            console.log(err)
        }else{
            
            res.render("index",{data:body});
        }
    })
});

//NEW show form to create new project entry
//get the data and send it to post campgrounds
app.get("/post/new",function(req,res){
    res.render("new");
});

//Create route
app.post("/post",function(req,res){
    var n=req.body.name;
    var img=req.body.image;
    var desc=req.body.desc;
    console.log(n);
    console.log(img);
    console.log(desc);
    var data={
        name:n,
        image:img,
        description:desc

    }

    Post.create(data,function(err,body){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/"); //it will redirect to get campgrounds route by default
        }
    });
});

//Show route
app.get("/post/:id",function(req,res){
  Post.findById(req.params.id,function(err,found){
    if(err){
        console.log(err);
    }else{
        console.log(found);
        res.render("show",{data:found});
    }
  });
});

//edit route
app.post("post//:id/edit",function(req,res){

});

//put req
app.put("/post/:id",function(req,res){

});

app.delete("/post/:id",function(req,res){

});


app.get("/login",function(req,res){
    res.render("login");
})

app.listen(3000,process.env.IP,function(){
    console.log("Server has started");
})