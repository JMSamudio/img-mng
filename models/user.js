var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var connect_option = {useMongoClient: true};
mongoose.connect("mongodb://localhost/fotos", connect_option);

var posibles_valores = ["M","F"];
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Ingresa un email válido"];

//el esquema del user con sus validaciones
var user_schema = new Schema ({
    name : String,
    username : {type : String, required : true, maxlength : [50, "Username muy largo"]},
    //
    password : {
        type : String,
        minlength : [8, "el password debe tener como mínimo 8 caracteres"],
        validate : {
            validator : function(p){
                return this.password_confirmation == p;
            },
        message : "Las contraseñas no coinciden"
        }
    },
    age : {type : Number, min : [5,"no puede ser menor a 5"], max : [100,"no puede ser mayor a 100"]},
    email : {type : String, required : "el email es requerido",match : email_match},
    date_of_birth : Date,
    sex : {type : String, enum : {values : posibles_valores, message : "Opcion no válida"}}
});

user_schema.virtual("password_confirmation").get(function(){
    return this.p_c;
}).set(function(password){
    this.p_c = password;
});

var User = mongoose.model("User",user_schema);

module.exports.User = User;