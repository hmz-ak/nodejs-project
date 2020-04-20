var express=require("express");
var router=express.Router();
var Post = require("../models/post");
var fs = require('fs');
global.appRoot = __dirname;

//for image uploading
var multer=require("multer"); 
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);
}
});
var fileFilter=function(req,res,cb){

}
var upload=multer({storage:storage, limits:{
    fileSize: 1024*1024*5
}});



//Index route
router.get("/",function(req,res){
    Post.find({},function(err,body){
        if(err){
            console.log(err)
        }else{
            
            res.render("projects/index",{data:body});
        }
    })
});

//NEW show form to create new project entry
//get the data and send it to post campgrounds
router.get("/new",function(req,res){
    res.render("projects/new");
});

//Create route
router.post("/",upload.single('image'),function(req,res){
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
            res.redirect("/index"); //it will redirect to get index route by default
        }
    });
});

//Show route
router.get("/:id",function(req,res){
  Post.findById(req.params.id,function(err,found){
    if(err){
        console.log(err);
    }else{
      
        res.render("projects/show",{data:found});
    }
  });
});

//edit route
router.get("/:id/edit",function(req,res){

    Post.findById(req.params.id,function(err,found){
        if(err){
            console.log(err);
        }else{
            res.render("projects/edit",{data:found});
        }
    });

});

//put req
router.put("/:id",upload.single('image'),function(req,res){
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
                if(img===found.image){ //if updated image is same as previous image
                    //do nothing
                }else{
                 fs.unlinkSync(found.image); //removes the image from uploads folder
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
        res.redirect("/index/"+req.params.id);
    }
 });
});

//delete route

router.delete("/:id",function(req,res){
    var image=req.body.image;
    Post.findByIdAndRemove(req.params.id,function(err,removed){
     if(err){
        console.log(err);
        }else{
         fs.unlinkSync(image);
         res.redirect("/index");
         }
     });

});

module.exports=router;