// Importar dependencias
const express = require("express");
const check = require("../middlewares/auth");
const limiter = require("../middlewares/limitRate");

//Cargar Router
const router = express.Router();

//Importar controlador
const UserController = require("../controllers/users");

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
router.get("/prueba", UserController.prueba);
router.post("/register", UserController.registerUser);
router.post("/login", limiter, UserController.loginUser);
router.put("/blockUser", check.auth, UserController.blockUser);
router.delete("/deleteUser", check.auth, UserController.deleteUser);
router.get("/getUsers", check.auth, UserController.getUsers);
router.get("/getUser/:idAdmin", check.auth, UserController.getUser);
router.get("/getRoleUser/:id", check.auth, UserController.getRoleUser);
router.patch("/confirmEmail/:email", UserController.confirmEmail);
router.patch("/updateUser/:id", check.auth, UserController.updateUser);
router.patch("/resetPassword", UserController.resetPassword);


//Exportar routes
module.exports = router;