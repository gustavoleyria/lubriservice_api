// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");
const limiter = require("../middlewares/limitRate");

//Cargar Router
const router = express.Router();

//Importar controlador
const TrabajoController = require("../controllers/trabajos");

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
router.get("/prueba", TrabajoController.prueba);
router.post("/trabajoRegister/:id", check.auth, TrabajoController.createTrabajo);
router.get("/getTrabajos/:id", check.auth, TrabajoController.getTrabajos);
router.get("/getTrabajo/:id", check.auth, TrabajoController.getTrabajo);
router.patch("/updatetrabajo/:id", check.auth, TrabajoController.updateTrabajo);


//Exportar routes
module.exports = router;