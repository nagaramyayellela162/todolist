//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");

const app = express();
mongoose.connect(process.env.MONGO_CONNECTION);
mongoose.set('strictQuery',false);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const itemsSchema=new mongoose.Schema({name:String});
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({name:"Welcome to Todo list"});
const item2=new Item({name:"Click + symbol to add"});
const item3=new Item({name:"Hit <-- to delete an item"});

const defaultItems=[item1,item2,item3];



app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){

    if(foundItems.length === 0){

      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log("error");
        }
        else{
          console.log("Success");
        }
      });
      res.redirect("/");

    }
    else{
      res.render("list", {listTitle:"Today", newListItems:foundItems});
 

    }
       
  });

  

});

app.post("/", function(req, res){

  const itemName= req.body.newItem;
  const add=new Item({
    name:itemName,
  })
  add.save();
  res.redirect("/")

});
app.post("/delete",function(req,res){
  const checkeditemId=req.body.checkbox;
  Item.deleteOne({_id:checkeditemId},function(err){
    if(err){
      console.log("error");
    }
    else{
      console.log("success");
    }
  })
  res.redirect("/");
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

let port=process.env.PORT;
if(port== null || port==""){
  port="3000";
}

app.listen(port, function() {
  console.log("Server started succesfully");
});


