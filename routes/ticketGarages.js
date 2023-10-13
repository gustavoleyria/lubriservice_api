// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");
const limiter = require("../middlewares/limitRate");

//Cargar Router
const router = express.Router();

//Importar controlador
const TicketGarageController = require("../controllers/ticketGarages");

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
router.get("/prueba", TicketGarageController.prueba);
router.get("/ticketByCar/:patente", TicketGarageController.getTicketGarageId);
router.get("/getDetalleOrden/:orden", TicketGarageController.getDetalleOrden);
router.get("/getAllTicketGarage/:id", check.auth, TicketGarageController.getAllTicketGarage);
router.post("/registerTicketGarage/:id", check.auth, TicketGarageController.createTicket);
router.patch("/agregarTrabajo/:id", check.auth, TicketGarageController.agregarTrabajoTicket);
router.patch("/deleteTrabajo/:id", check.auth, TicketGarageController.deleteTrabajoTicket);
router.patch("/agregarTrabajador/:id", check.auth, TicketGarageController.agregarTrabajadorTicket);
router.patch("/deleteTrabajador/:id", check.auth, TicketGarageController.deleteTrabajadorTicket);
router.patch("/terminarTicketOrden/:id/:orden", check.auth, TicketGarageController.terminarTicketOrden);


//Exportar routes
module.exports = router;