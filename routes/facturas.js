// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");
const limiter = require("../middlewares/limitRate");

//Cargar Router
const router = express.Router();

//Importar controlador
const FacturaController = require("../controllers/facturas");

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
router.get("/prueba", FacturaController.prueba);
router.post("/createFactura/:id", check.auth, FacturaController.createFactura);
// // // router.post("/login", limiter, UserController.loginUser);
// // // router.put("/blockUser", check.auth, UserController.blockUser);
// // // router.delete("/deleteUser", check.auth, UserController.deleteUser);
router.get("/listarFacturas/:id", check.auth, FacturaController.listarFacturas);
router.get("/listarFactura/:id/:idFactura", check.auth, FacturaController.listarFactura);
router.patch("/anularFactura/:id/:idFactura", check.auth, FacturaController.anularFactura);
router.patch("/activarFactura/:id/:idFactura", check.auth, FacturaController.activarFactura);
// router.patch("/deleteTrabajo/:id", check.auth, TicketGarageController.deleteTrabajoTicket);
// router.patch("/agregarTrabajador/:id", check.auth, TicketGarageController.agregarTrabajadorTicket);
// router.patch("/deleteTrabajador/:id", check.auth, TicketGarageController.deleteTrabajadorTicket);


//Exportar routes
module.exports = router;