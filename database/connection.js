//Importar mongoose
const mongoose = require("mongoose");
require('dotenv').config();
const MONGODB_URI_LOCAL = process.env.MONGODB_URI_LOCAL;
const MONGODB_URI_WEB = process.env.MONGODB_URI_WEB;


//Metodo de conexion
const connection = async()=>{
    try{
        console.log(process.env.MONGODB_URI_WEB)
        console.log(MONGODB_URI_WEB)
        // mongoose.set('strictQuery', true)
        // await mongoose.connect(`${MONGODB_URI}`);
        await mongoose.connect(MONGODB_URI_WEB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log("Conectado exitosamente a la BD app_lubriservice");
    }catch(error){
        console.log(error);
        throw new Error("No se ha podido conectar a la BD");
    }
}

//Exportar conexion
module.exports = connection;