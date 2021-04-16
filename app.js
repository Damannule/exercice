const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const methodeOverride = require("method-override");

const app = express();

// Handlebars
app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'hbs');

// BodyParser
app.use(bodyParser.urlencoded({
    extended: true,
}));

//Method-override
app.use(methodeOverride("_method"));

// MongoDB

 mongoose.connect("mongodb://localhost:27017/boutiqueGame", { useNewUrlParser : true});
 const productSchema = {
     title : String,
     content : String,
     price : Number,
 };

 const Product = mongoose.model("product", productSchema);

// Routes
app.route("/")
.get(function(req,res){
    Product.find(function(err, produit){
        if (!err){
            res.render("index",{product : produit});
        }else{
            res.send(err);
        }
    });
})
.post((req, res)=>{
    const newProduct = new Product({
        title : req.body.title,
        content : req.body.content,
        price : req.body.price
    });
    newProduct.save((err)=>{
        if(!err){
            res.send("save ok");
        }else{
            res.send(err);
        }
    });
})

.delete((req, res)=>{
    Product.deleteMany((err)=>{
        if(!err){
            res.send("All delete");
        }else{
            res.send(err);
        }
    })
})

//Route édition

app.route("/:id")
.get((req, res)=>{
    //Adventure.findOne({ country: 'Croatia' }, function (err, adventure) {});
    Product.findOne({_id : req.params.id},(err, produit)=>{
        if(!err){
            res.render("edition", {
                _id : produit.id,
                title : produit.title,
                content : produit.content,
                price : produit.price,
            });
        }else{
            res.send(err);
        }
    });
})

.put((req, res)=>{
    //MyModel.update({ age: { $gt: 18 } }, { oldEnough: true }, fn);
    Product.update(
        //condition
        {_id : req.params.id},
        //update
        {
            title : req.body.title,
            content : req.body.content,
            price : req.body.price,
        },
        //option
        {multi : true},
        //exec
        (err)=>{
            if(!err){
                res.render("edition");
            }else{
                res.send(err);
            }
        },
    );
})

.delete((req, res)=>{
    Product.deleteOne(
        //condition
        {_id : req.params.id},
        //exec
        (err)=>{
            if(!err){
               res.render("index");
            }else{
                res.send(err);
            }
        },
    );
});

app.listen(2999, function() {
    console.log("écoute le port 3000");

})
