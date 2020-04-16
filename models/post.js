var mongoose=require("mongoose");
Schema=new mongoose.Schema({
    name:String,
    image:String,
    description:String
});

module.exports=new mongoose.model("Post",Schema);