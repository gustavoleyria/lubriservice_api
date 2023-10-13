//Importaciones
const bcrypt = require("bcrypt");
const User = require('../models/users');
const Trabajos = require('../models/trabajos');
const jwt = require("../helpers/jwt");
const validateTrabajo = require('../helpers/validateTrabajo');
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
        message: "Mensaje enviado desde ./controllers/trabajos.js"
    });
}

//Crear un trabajo
const createTrabajo = async (req,res) => {
    const { id } = req.params;
    const { trabajo, detalle, precio } = req.body

    try {
        //Verificar permisos de usuario
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Validar datos
        validateTrabajo({ trabajo, detalle, precio });

        //Validar que el trabajo no exista
        const task = await Trabajos.findOne({trabajo});

        if(task){
            return res.status(400).json({  status: "error", message: "Trabajo ya registrado" });
        };

        //Crear nuevo registro
        const newTrabajo ={
            trabajo, 
            detalle, 
            precio
        };

        const newTask = new Trabajos(newTrabajo);
        await newTask.save();

        return res.status(200).send({
            status: "success",
            message: "Trabajo registrado correctamente.",
            newTask
          });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Actualizar un trabajo
const updateTrabajo = async (req,res) => {
    const { id } = req.params;
    const { idTrabajo, trabajo, detalle, precio } = req.body

    try {
        //Verificar permisos de usuario
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Validar datos
        validateTrabajo({ trabajo, detalle, precio });

        //Validar que el trabajo exista
        const task = await Trabajos.findById(idTrabajo);

        if(!task){
            return res.status(400).json({  status: "error", message: "Trabajo no registrado" });
        };

         //Actualiza nuevo registro
         const updatedTrabajo = await Trabajos.findByIdAndUpdate(
            task._id,
            {
                trabajo, 
                detalle, 
                precio
            },
            { new: true } // Retorna el trabajador actualizado
        );

        return res.status(200).send({
            status: "success",
            message: "Trabajo actualizado correctamente.",
            updatedTrabajo
          });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Listado de trabajos
const getTrabajos = async (req,res) => {
    const { id } = req.params;

    try {
        //Validar usuario autorizado
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Obtener listado
        const trabajos = await Trabajos.find();

        if(!trabajos){
            return res.status(401).json({status: "error", message: "Trabajos no encontrados" });
        };

        return res.status(200).send({
            status: "success",
            message: "Listado de trabajos",
            trabajos
          });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Listado de trabajos
const getTrabajo = async (req,res) => {
    const { id } = req.params;
    const { idTrabajo } = req.body;

    try {
        //Validar usuario autorizado
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Obtener listado
        const trabajo = await Trabajos.findById(idTrabajo);

        if(!trabajo){
            return res.status(401).json({status: "error", message: "Trabajo no encontrado" });
        };

        return res.status(200).send({
            status: "success",
            message: "Detalle de trabajo",
            trabajo
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
    createTrabajo,
    updateTrabajo,
    getTrabajos,
    getTrabajo
}