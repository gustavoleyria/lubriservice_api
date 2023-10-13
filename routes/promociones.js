// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");
const limiter = require("../middlewares/limitRate");

//Cargar Router
const router = express.Router();

//Importar controlador
const PromocionController = require("../controllers/promociones");

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
router.get("/prueba", PromocionController.prueba);
router.post("/crearPromocion/:id", check.auth, PromocionController.crearPromocion);
router.delete("/deletePromocion/:id", check.auth, PromocionController.deletePromocion);
router.get("/listPromociones", PromocionController.listPromociones);
router.get("/listPromocion/:id", PromocionController.listPromocion);
router.patch("/updatePromocion/:id", check.auth, PromocionController.updatePromocion);
router.patch("/changeStatusPromocion/:id", check.auth, PromocionController.changeStatusPromocion);


//Exportar routes
module.exports = router;