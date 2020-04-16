var express=require("express");
var app=express();

app.use(express.static(__dirname + '/public'));

app.set("view engine","ejs");

//Index route
app.get("/",function(req,res){
    res.render("index");
});

//NEW show form to create new project entry
//get the data and send it to post campgrounds
app.get("/post/new",function(req,res){
    res.render("new");
});

//Create route
app.post("/post",function(req,res){
    res.send("You reached here")
});

//Show route
app.get("/post/:id",function(req,res){
  
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