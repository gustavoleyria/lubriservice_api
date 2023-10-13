//Importaciones
const bcrypt = require("bcrypt");
const User = require('../models/users');
const Trabajadores = require('../models/trabajadores');
const jwt = require("../helpers/jwt");
const validateTrabajador = require('../helpers/validateTrabajador');
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
        message: "Mensaje enviado desde ./controllers/trabajadores.js"
    });
}

//Dar de alta un trabajador
const trabajadorRegister = async (req,res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, especialidad, sueldo_mensual, costo_hora=0 } = req.body;

    try {
        //Verificar usuario autorizado
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Validar datos de entada
        validateTrabajador({ nombre, apellido, dni, especialidad, sueldo_mensual });

        //Validar que trabajador no exista
        const worker = await Trabajadores.findOne({dni});

        if(worker){
            return res.status(400).json({  status: "error", message: "Trabajador ya registrado" });
        };

        //Crear nuevo registro
        const newTrabajador ={
            nombre, 
            apellido, 
            dni, 
            especialidad, 
            sueldo_mensual: parseFloat(sueldo_mensual), // Convertir a número
            costo_hora: parseFloat(costo_hora), // Convertir a número
        };

        const trabajador = new Trabajadores(newTrabajador);
        await trabajador.save();

        return res.status(200).send({
            status: "success",
            message: "Empleado registrado correctamente.",
            trabajador
          });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }


}

//Actualizar datos del trabajador
const updateTrabajador = async (req,res) => {
    const { id } = req.params;
    const { idTrabajador, nombre, apellido, dni, especialidad, sueldo_mensual, costo_hora=0 } = req.body;

    try {
        //Verificar usuario autorizado
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Validar datos de entada
        validateTrabajador({ nombre, apellido, dni, especialidad, sueldo_mensual });

        //Validar que trabajador no exista
        const worker = await Trabajadores.findById(idTrabajador);

        if(!worker){
            return res.status(404).json({  status: "error", message: "Trabajador no registrado" });
        };

        // Calcular el costo_hora manualmente
        const nuevoCostoHora = sueldo_mensual / (25 * 8);

        //Actualiza nuevo registro
        const updatedTrabajador = await Trabajadores.findByIdAndUpdate(
            worker._id,
            {
                nombre,
                apellido,
                dni,
                especialidad,
                sueldo_mensual: parseFloat(sueldo_mensual),
                costo_hora: nuevoCostoHora // Actualizar el costo_hora
            },
            { new: true } // Retorna el trabajador actualizado
        );

        return res.status(200).send({
            status: "success",
            message: "Empleado actualizado correctamente.",
            updatedTrabajador
          });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }


}

//Bloquear/Desbloquear trabajador
const changeStateTrabajador = async (req,res) => {
    const { id } = req.params;
    const { idTrabajador} = req.body;

    try {
        //Verificar usuario autorizado
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Validar que trabajador no exista
        const worker = await Trabajadores.findById(idTrabajador);

        if(!worker){
            return res.status(404).json({  status: "error", message: "Trabajador no registrado" });
        };

        //Actualiza nuevo registro
        const updatedTrabajador = await Trabajadores.findByIdAndUpdate(
            worker._id,
            {
                activo: !worker.activo
            },
            { new: true } // Retorna el trabajador actualizado
        );

        if(updatedTrabajador.activo){
            return res.status(200).send({
                status: "success",
                message: "Empleado activado correctamente.",
                updatedTrabajador
              });
        }else{
            return res.status(200).send({
                status: "success",
                message: "Empleado bloqueado correctamente.",
                updatedTrabajador
              });
        }

        

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }


}

//Listado de empleados
const getTrabajadores = async (req, res) => {
    const { id } = req.params;

    try {
        //Verificar si esta autorizado
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Obtener listado
        const trabajadores = await Trabajadores.find();

        if(!trabajadores){
            return res.status(404).json({  status: "error", message: "Trabajadores no encontrados" });
        }

        return res.status(200).send({
            status: "success",
            message: "Lista de Empleados",
            trabajadores
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió emitir listado"
          });
    }    

}

//Listado de un empleado
const getTrabajador = async (req, res) => {
    const { id } = req.params;
    const { idTrabajador } = req.body;

    try {
        //Verificar si esta autorizado
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Obtener listado
        const trabajador = await Trabajadores.findById(idTrabajador);

        if(!trabajador){
            return res.status(404).json({  status: "error", message: "Trabajador no encontrado" });
        }

        return res.status(200).send({
            status: "success",
            message: "Empleado Listado",
            trabajador
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió emitir listado"
          });
    }    

}



//Exportar acciones
module.exports = {
    prueba,
    trabajadorRegister,
    updateTrabajador,
    changeStateTrabajador,
    getTrabajadores,
    getTrabajador
}