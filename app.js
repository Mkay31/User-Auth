
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/clientDB",{useNewUrlParser: true});


const usersSchema=new mongoose.Schema({
  fName:{
    type: String,
    required: true
  },
  lName:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  encPassword:{
    type: String,
    required: true
  }

})


usersSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["encPassword"]});
const User =new  mongoose.model("User",usersSchema);






app.get("/", function(req,res){
  res.render("home");
});

app.get("/signup",function(req,res){
  res.render("signup");
});

app.get("/login",function(req,res){
  res.render("login");
});



app.post("/signup",function(req,res){

  const user=new User({
    fName:req.body.FirstName,
    lName:req.body.LastName,
    email:req.body.Email,
    encPassword:req.body.Password
  });
  user.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/login");
    }

  });

});

app.post("/login",function(req,res){
  const userEmail=req.body.Email;
  const userPassword=req.body.Password;
  User.findOne({email: userEmail},function(err,found){
    if(err){
      console.log(err);
    }else{
      if(found){
        if(found.encPassword===userPassword){
          res.render("post",{msg:"Login Success"});
        }else{
          res.render("post",{msg:"Wrong Password"});
        }
      }else{
        res.render("post",{msg:"user not found"});
      }
    }
  })
});












app.listen(3000,function(){
  console.log("app is running on local port");
});
