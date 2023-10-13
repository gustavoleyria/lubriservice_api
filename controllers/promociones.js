//Importaciones
const bcrypt = require("bcrypt");
const User = require('../models/users');
const Cars = require('../models/cars');
const Promociones = require('../models/promociones');
const jwt = require("../helpers/jwt");
const validateCar = require('../helpers/validateCar');
const nodemailer = require("nodemailer");
require('dotenv').config();
const secret = process.env.CLAVE_SECRETA;
const mail = process.env.MAIL;
const mailpass = process.env.MAILPASS;
const decifrar = process.env.ENCRITANDO;


//Accion de prueba
const prueba = (req,res)=>{

    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde ./controllers/promociones.js"
    });
}

//Crear promocion
const crearPromocion = async(req,res)=>{
    const { id } = req.params;
    const { titulo, detalle, mes, imagen } = req.body;

    try {
        //Verificar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Verificar datos
        if(!titulo || !detalle || !mes || !imagen){
            return res.status(404).json({status: "error", message: "Faltan ingresar datos" });
        }

        //Crear nuevo registro
        const newPromocion ={
            titulo, 
            detalle, 
            mes, 
            imagen
        };

        const promocion = new Promociones(newPromocion);
        await promocion.save();

        return res.status(200).send({
            status: "success",
            message: "Promocion registrada correctamente.",
            promocion
          });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Modificar promocion
const updatePromocion = async(req,res)=>{
    const { id } = req.params;
    const { idPromocion, titulo, detalle, mes, imagen } = req.body;

    try {
        //Verificar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Verificar datos
        if(!idPromocion || !titulo || !detalle || !mes || !imagen){
            return res.status(404).json({status: "error", message: "Faltan ingresar datos" });
        }
        
        //Verificar promocion
        const promocion = await Promociones.findById(idPromocion);
        if(!promocion){
            return res.status(404).json({status: "error", message: "No se encontró la promocion" });
        }


        //Actualiza nuevo registro
        const updatedPromocion = await Promociones.findByIdAndUpdate(
            promocion._id,
            {
                titulo,
                detalle,
                mes,
                imagen
            },
            { new: true } // Retorna el trabajador actualizado
        );

        return res.status(200).send({
            status: "success",
            message: "Promocion registrada correctamente.",
            updatedPromocion
          });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Modificar promocion
const changeStatusPromocion = async(req,res)=>{
    const { id } = req.params;
    const { idPromocion } = req.body;

    try {
        //Verificar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Verificar datos
        if(!idPromocion){
            return res.status(404).json({status: "error", message: "Faltan ingresar datos" });
        }
        
        //Verificar promocion
        const promocion = await Promociones.findById(idPromocion);
        if(!promocion){
            return res.status(404).json({status: "error", message: "No se encontró la promocion" });
        }


        //Actualiza nuevo registro
        const updatedPromocion = await Promociones.findByIdAndUpdate(
            promocion._id,
            {
                activo: !promocion.activo
            },
            { new: true } // Retorna el trabajador actualizado
        );

        if(updatedPromocion.activo){
            return res.status(200).send({
                status: "success",
                message: "Promocion activada correctamente.",
                updatedPromocion
              });
        }

        return res.status(200).send({
            status: "success",
            message: "Promocion bloqueada correctamente.",
            updatedPromocion
          });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Eliminar promocion
const deletePromocion = async(req,res)=>{
    const { id } = req.params;
    const { idPromocion } = req.body;

    try {
        //Verificar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Verificar datos
        if(!idPromocion){
            return res.status(404).json({status: "error", message: "Faltan ingresar datos" });
        }
        
        //Verificar promocion
        const promocion = await Promociones.findByIdAndDelete(idPromocion);
        if(!promocion){
            return res.status(404).json({status: "error", message: "No se encontró la promocion" });
        }

        return res.status(200).send({
            status: "success",
            message: "Promocion eliminada correctamente."
          });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Lista de promociones
const listPromociones = async(req,res)=>{
    try {        
        //Verificar promociones
        const promociones = await Promociones.find();
        if(!promociones){
            return res.status(404).json({status: "error", message: "No se encontraron promociones" });
        }

        return res.status(200).send({
            status: "success",
            message: "Lista de promociones.",
            promociones
          });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Lista de promociones
const listPromocion = async(req,res)=>{
    const { id } = req.params;
    try {        
        //Verificar promociones
        const promocion = await Promociones.findById(id);
        if(!promocion){
            return res.status(404).json({status: "error", message: "No se encontraró promoción" });
        }

        return res.status(200).send({
            status: "success",
            message: "Lista de promociones.",
            promocion
          });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Exportar acciones
module.exports = {
    prueba,
    crearPromocion,
    updatePromocion,
    changeStatusPromocion,
    deletePromocion,
    listPromociones,
    listPromocion
}