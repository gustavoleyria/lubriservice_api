// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");
const limiter = require("../middlewares/limitRate");

//Cargar Router
const router = express.Router();

//Importar controlador
const TrabajadoresController = require("../controllers/trabajadores");

//Configuracion de subida
// const multer = require("multer");

// const storage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null,"./upload/avatars/");
//     },
//     filename: (req,file,cb)=>{
//         cb(null,"avatar-"+Date.now()+"-"+file.originalname);
//     }
// })

// const uploads = multer({storage});


//Definir rutas
router.get("/prueba", TrabajadoresController.prueba);
router.post("/trabajadorRegister/:id", check.auth, TrabajadoresController.trabajadorRegister);
router.get("/getTrabajadores/:id", check.auth, TrabajadoresController.getTrabajadores);
router.get("/getTrabajador/:id", check.auth, TrabajadoresController.getTrabajador);
router.patch("/updateTrabajador/:id", check.auth, TrabajadoresController.updateTrabajador);
router.patch("/changeStateTrabajador/:id", check.auth, TrabajadoresController.changeStateTrabajador);


//Exportar routes
module.exports = router;