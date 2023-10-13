// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");
const limiter = require("../middlewares/limitRate");

//Cargar Router
const router = express.Router();

//Importar controlador
const CarController = require("../controllers/cars");

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
router.get("/prueba", CarController.prueba);
router.post("/registerCar/:id", check.auth, CarController.carRegister);
// router.post("/login", limiter, UserController.loginUser);
// router.put("/blockUser", check.auth, UserController.blockUser);
// router.delete("/deleteUser", check.auth, UserController.deleteUser);
router.get("/getCars/:id", check.auth, CarController.getCars);
router.get("/getCar/:id/:patente", check.auth, CarController.getCar);
// router.patch("/confirmEmail/:email", UserController.confirmEmail);
router.patch("/updateCar/:id/:patenteUpdate", check.auth, CarController.updateCar);


//Exportar routes
module.exports = router;