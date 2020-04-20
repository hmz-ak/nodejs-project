var express=require("express");
var app=express();
var parser=require("body-parser");
var methodOverride=require("method-override");
var mongoose=require("mongoose");
var projectRoute=require("./routes/projects");

//for image uploading

app.use('/uploads',express.static("uploads")); //makes the folder publicily available


app.use(parser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method")); //for method overriding

app.set("view engine","ejs");

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost:27017/portfolio_db",{useNewUrlParser: true,useUnifiedTopology: true});


app.use("/index",projectRoute);

app.listen(3000,process.env.IP,function(){
    console.log("Server has started");
})