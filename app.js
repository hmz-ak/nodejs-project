var express=require("express");
var app=express();
var parser=require("body-parser");
var Post=require("./models/post");
var fs = require('fs');
var methodOverride=require("method-override");
var mongoose=require("mongoose");
var multer=require("multer"); //for image uploading
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
}
});

var fileFilter=function(req,res,cb){

}

var upload=multer({storage:storage, limits:{
    fileSize: 1024*1024*5
}});



app.use(parser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/uploads',express.static("uploads")); //makes the folder publicily available
app.use(methodOverride("_method")); //for method overriding

app.set("view engine","ejs");

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

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
app.post("/post",upload.single('image'),function(req,res){
    var n=req.body.name;
    var img=req.file.path;
    var desc=req.body.desc;
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
      
        res.render("show",{data:found});
    }
  });
});

//edit route
app.get("/post/:id/edit",function(req,res){

    Post.findById(req.params.id,function(err,found){
        if(err){
            console.log(err);
        }else{
            res.render("edit",{data:found});
        }
    });

});

//put req
app.put("/post/:id",upload.single('image'),function(req,res){
    if(req.file){
        var n=req.body.name;
        var img=req.file.path;
        var desc=req.body.desc;
        var data={
            name:n,
            image:img,
            description:desc 
        }

        //this code snippet ensures that previous image is removed from uploads folder if updating of image is being performed!
        Post.findById(req.params.id,function(err,found){
            if(err){
                console.log(err);
            }else{
                if(img===found.image){
                    //do nothing
                }else{
                 fs.unlinkSync(found.image);
                }
            }
        })
             
    }else{
        var n=req.body.name;
        var desc=req.body.desc;
        var data={
            name:n, 
            description:desc 
        }
    }
 Post.findByIdAndUpdate(req.params.id,data,function(err,updated){
    if(err){
        console.log(err);
    }else{   
        res.redirect("/post/"+req.params.id);
    }
 });
});

//delete route

app.delete("/post/:id",function(req,res){
    var image=req.body.image;
    Post.findByIdAndRemove(req.params.id,function(err,removed){
     if(err){
        console.log(err);
        }else{
         fs.unlinkSync(image);
         res.redirect("/");
         }
     });

});


app.get("/login",function(req,res){
    res.render("login");
})

app.listen(3000,process.env.IP,function(){
    console.log("Server has started");
})