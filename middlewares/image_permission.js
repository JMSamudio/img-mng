var Image = require("../models/imagenes");
//true: tienes permisos
//false: no tienes permisos
module.exports = function(imagen, req, res){

    //condicional que permite saber si el usuario quiere ver una imagen y no editarla
    if(req.method === "GET" && req.path.indexOf("edit") < 0 ){
        return true;
    };

    if(typeof imagen.creator == "undefined") return false;

    if(imagen.creator._id.toString() == res.locals.user._id){
        return true;
    }

    return false;

}