var express = require("express");
var Image = require("./models/imagenes");
var router = express.Router();
var image_finder_middleware = require("./middlewares/find_image");

router.all("/imagenes/:id*", image_finder_middleware);

router.get("/", function(req, res){
    res.render("app/home");
});

router.get("/app/imagenes/new", function(req, res){
    res.render("/app/imagenes/new");
});

router.get("/imagenes/:id/edit", function(req, res){
    res.render("app/imagenes/edit");
});

//REST
router.route("/imagenes/:id")
    .get(function(req, res){
        res.render("app/imagenes/show");
    })
    .put(function(req, res){
        res.locals.imagen.title = req.body.title;
        res.locals.imagen.save(function(err){
            if(!err){
                res.render("app/imagenes/show");
            }else{
                res.render("app/imagenes/" + req.params.id + "/edit");
            }
        });
    })
    .delete(function(req, res){
        Image.findOneAndRemove({_id : req.params.id}, function(err){
            if(!err){
                res.redirect("/app/imagenes");
            }else{
                console.log(err);
                res.redirect("/app/imagenes/" + req.params.id);
            }
        })
    });
/**
 * POST: estamos intentando agregar un nuevo recurso a la coleccion de imagenes
 * GET: estamos intentando obtener una coleccion de imagenes
 */
router.route("/imagenes")
    .get(function(req, res){
        //creator : res.locals.user._id
        Image.find({}, function(err, imagenes){
            if(err) {res.redirect("/app"); return; };
            res.render("app/imagenes/index", {imagenes : imagenes});
        });
    })
    .post(function(req, res){
        var extension = req.body.archivo.name.split(".").pop();
        var data = {
            title : req.body.title,
            creator : res.locals.user._id,
            extension : extension
        };

        var imagen = new Image(data);

        imagen.save(function(err){
            if(!err){
                fs.rename(req.body.archivo.path, "public/imagenes"+ imagen._id + "."+ extension);
                res.redirect("/app/imagenes/" + imagen._id)
            }else {
                res.render(err);
            }
        });
});

module.exports = router;