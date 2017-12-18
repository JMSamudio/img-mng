var express = require("express");
var body_parser = require("body-parser");
var User = require("./models/user").User;
var cookie_session = require("cookie-session");
var router_app = require("./routes_app");
var session_middlewares = require("./middlewares/sessions");
var method_override = require("method-override");
var formidable = require("express-formidable");
var fs = require("fs");

var app = express();

//section use
app.use("/public", express.static('public'));

app.use(body_parser.json()); //
app.use(body_parser.urlencoded({extended : true}));

app.use(method_override("_method"));

app.use(cookie_session({
    name : "session",
    keys : ["llave-1","llave-2"]
}));

app.use(formidable({keepExtensions: true}));

app.use("/app", session_middlewares);
app.use("/app", router_app);

//seting view engine
app.set("view engine", "jade");

//vista para la raiz
app.get("/", function(req, res){
    console.log(req.session.user_id);
    res.render("index");
});

//render del signup
app.get("/signup", function(req, res){
    User.find(function(err, doc){
        console.log("doc" + doc);
        res.render("signup");
    });

});

//render del login
app.get("/login", function(req, res){
    res.render("login");
});

//se recibe la paticion de nuevo usuario del signup y se envia a la base de datos
app.post("/users", function(req, res){
    var user = new User({
                            email                   : req.body.email,
                            password                : req.body.password,
                            password_confirmation   : req.body.password_confirmation,
                            username                : req.body.username
                        }
                    );

    user.save().then(function(useer){
        res.send("se guardó exitosamente el usuario");
    }, function(err){
        console.log(String(err));
        res.send("No pudimos guardar la informacion");
    });

});

//render de session
app.post("/sessions", function(req, res){
    User.findOne({email : req.body.email, password : req.body.password}, function(err, user){
        if (!err){
            req.session.user_id = user._id;
            res.redirect("/app");
        }else{
            console.log(err);
        }
        //res.redirect("app");
    });
});

app.listen(8080);
console.log("====>servidor iniciado<=====");