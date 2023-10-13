//Importaciones
const bcrypt = require("bcrypt");
const User = require('../models/users');
const Cars = require('../models/cars');
const Trabajadores = require('../models/trabajadores');
const Trabajos = require('../models/trabajos');
const jwt = require("../helpers/jwt");
const validateCar = require('../helpers/validateCar');
const nodemailer = require("nodemailer");
const TicketGarage = require("../models/ticketGarage");
const Factura = require("../models/facturas");
require('dotenv').config();
const secret = process.env.CLAVE_SECRETA;
const mail = process.env.MAIL;
const mailpass = process.env.MAILPASS;
const decifrar = process.env.ENCRITANDO;


//Accion de prueba
const prueba = (req,res)=>{

    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde ./controllers/ticketGarages.js"
    });
}

//Crear un ticket
const createTicket = async (req,res) => {
    const { id } = req.params;
    const { carId, observacionRecepcion, trabajoId, trabajadorId, km } = req.body;

    try {
        //Validar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Validar datos de forma simple
        if(!carId || !observacionRecepcion || observacionRecepcion.length > 300 || !trabajoId || !trabajadorId){
            return res.status(404).json({status: "error", message: "Faltan datos o la observación supera los 300 caracteres" });
        };

        //Crear nuevo registro
        const newTicket ={
            carId, 
            observacionRecepcion, 
            trabajoId,
            trabajadorId,
            km
        };

        const ticketGarage = new TicketGarage(newTicket);
        await ticketGarage.save();

        return res.status(200).send({
            status: "success",
            message: "TicketGarage registrado correctamente.",
            ticketGarage
          });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }

}

//Agregar trabajo a la orden
const agregarTrabajoTicket = async (req,res) => {
    const { id } = req.params;
    const { idTicket, idTrabajo } = req.body;

    try {
        //Validar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Validar si existe ticket
        const ticket = await TicketGarage.findById(idTicket);

        if(!ticket){
            return res.status(401).json({ message: "Ticket no encontrado" });
        };

        //Validar datos del trabajo
        if(!idTrabajo || idTrabajo === ""){
            return res.status(401).json({ message: "Datos de trabajo no encontrado" });
        }

        // Validar si el idTrabajo ya está en el arreglo trabajoId
        if (ticket.trabajoId.includes(idTrabajo)) {
            return res.status(400).json({ message: "El idTrabajo ya existe en el ticket" });
        }

        // Ahora, agrega el idTrabajo al ticket
        ticket.trabajoId.push(idTrabajo);

        // Guarda el ticket actualizado en la base de datos
        await ticket.save();

        return res.status(200).send({
            status: "success",
            message: "TicketGarage registrado correctamente.",
            ticket
          });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Eliminar un trabajo a la orden
const deleteTrabajoTicket = async (req,res) => {
    const { id } = req.params;
    const { idTicket, idTrabajo } = req.body;

    try {
        //Validar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Validar si existe ticket
        const ticket = await TicketGarage.findById(idTicket);

        if(!ticket){
            return res.status(401).json({ message: "Ticket no encontrado" });
        };

        //Validar datos del trabajo
        if(!idTrabajo || idTrabajo === ""){
            return res.status(401).json({ message: "Datos de trabajo no encontrado" });
        }

        // Validar si el idTrabajo ya está en el arreglo trabajoId
        if (!ticket.trabajoId.includes(idTrabajo)) {
            return res.status(400).json({ message: "El idTrabajo no existe en el ticket" });
        }

        // Ahora, elimina el idTrabajo del ticket
        ticket.trabajoId = ticket.trabajoId.filter(trabajo => trabajo.toString() !== idTrabajo);

        // Guarda el ticket actualizado en la base de datos
        await ticket.save();

        return res.status(200).send({
            status: "success",
            message: "idTrabajo eliminado del TicketGarage correctamente.",
            ticket
          });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Agregar trabajador a la orden
const agregarTrabajadorTicket = async (req,res) => {
    const { id } = req.params;
    const { idTicket, idTrabajador } = req.body;

    try {
        //Validar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Validar si existe ticket
        const ticket = await TicketGarage.findById(idTicket);

        if(!ticket){
            return res.status(401).json({ message: "Ticket no encontrado" });
        };

        //Validar datos del trabajo
        if(!idTrabajador || idTrabajador === ""){
            return res.status(401).json({ message: "Datos de trabajo no encontrado" });
        }

        // Validar si el idTrabajo ya está en el arreglo trabajoId
        if (ticket.trabajadorId.includes(idTrabajador)) {
            return res.status(400).json({ message: "El idTrabajador ya existe en el ticket" });
        }

        // Ahora, agrega el idTrabajo al ticket
        ticket.trabajadorId.push(idTrabajador);

        // Guarda el ticket actualizado en la base de datos
        await ticket.save();

        return res.status(200).send({
            status: "success",
            message: "TicketGarage registrado correctamente.",
            ticket
          });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Eliminar un trabajador a la orden
const deleteTrabajadorTicket = async (req,res) => {
    const { id } = req.params;
    const { idTicket, idTrabajador } = req.body;

    try {
        //Validar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Validar si existe ticket
        const ticket = await TicketGarage.findById(idTicket);

        if(!ticket){
            return res.status(401).json({ message: "Ticket no encontrado" });
        };

        //Validar datos del trabajo
        if(!idTrabajador || idTrabajador === ""){
            return res.status(401).json({ message: "Datos de trabajador no encontrado" });
        }

        // Validar si el idTrabajo ya está en el arreglo trabajoId
        if (!ticket.trabajadorId.includes(idTrabajador)) {
            return res.status(400).json({ message: "El idTrabajador no existe en el ticket" });
        }

        // Ahora, elimina el idTrabajo del ticket
        ticket.trabajadorId = ticket.trabajadorId.filter(trabajador => trabajador.toString() !== idTrabajador);

        // Guarda el ticket actualizado en la base de datos
        await ticket.save();

        return res.status(200).send({
            status: "success",
            message: "idTrabajo eliminado del TicketGarage correctamente.",
            ticket
          });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Obtener listado de todos los trabajos
const getAllTicketGarage = async(req,res)=>{
    const { id } = req.params;

    try {
        //Verificar permisos de usuario
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR" && user.role !== "MECANICO"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Verificar que existan tickets
        const tickets = await TicketGarage.find();

        if(!tickets){
            return res.status(401).json({ message: "Sin trabajos encontrados" });
        };

        return res.status(200).send({
            status: "success",
            message: "Listado de trabajos",
            tickets
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }    

}

//Obtener listado de un Trabajo
const getTicketGarageId = async(req,res)=>{
    const { patente } = req.params;

    try {
        //Verificar que existan el vehículo
        const car = await Cars.findOne({patente});

        if(!car){
            return res.status(401).json({ message: "Vehículo no encontrado" });
        };

        //Verificar que existan tickets con esa patente
        const tickets = await TicketGarage.find({carId:car._id});

        if(!tickets){
            return res.status(401).json({ message: "Vehículo sin trabajos encontrados" });
        };

        return res.status(200).send({
            status: "success",
            message: "Listado de trabajos realizados",
            tickets
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }    

}

//Dar detalle de la orden
const getDetalleOrden = async(req,res)=>{
    const { orden } = req.params;

    try {
        //Verificar que exista orden
        const ticket = await TicketGarage.findOne({orden});

        if(!ticket){
            return res.status(401).json({ message: "Orden no encontrado" });
        };

        //Verificar que exista factura
        const factura = await Factura.findOne({ordenId:ticket._id});

        //Buscar trabajos si no existe facura
        const detalles = [];

        if(!factura){
            if(ticket.trabajoId.length >= 1){
            

                // Itera sobre los IDs de trabajos y busca los detalles en la base de datos
                for (const idTrabajo of ticket.trabajoId) {
                    const detalle = await Trabajos.findById(idTrabajo);
            
                    if (detalle) {
                    // Agrega el detalle del trabajo al array de detalles
                    detalles.push(detalle.detalle);
                    }
                }
            }
        }

        //Buscar trabajadores
        const trabajadores = [];

        // Itera sobre los IDs de trabajos y busca los detalles en la base de datos
        if(ticket.trabajadorId.length > 0){
            for (const idTrabajador of ticket.trabajadorId) {
                const trabajador = await Trabajadores.findById(idTrabajador);
        
                if (trabajador) {
                // Agrega el detalle del trabajo al array de detalles
                trabajadores.push(`${trabajador.nombre} ${trabajador.apellido} ${trabajador.especialidad}`);
                }
            }
        }

        //Datos del vehiculo
        const car = await Cars.findById(ticket.carId);

        //Devolver respuesta
        return res.status(200).send({
            status: "success",
            message: "Detalle de orden",
            ticket,
            factura,
            detalles,
            trabajadores,
            car
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }

    
    


}

//Dar detalle de la orden
const terminarTicketOrden = async(req,res)=>{
    const { id, orden } = req.params;

    try {
        //Validar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Verificar que exista orden
        const ticket = await TicketGarage.findOne({orden});

        if(!ticket){
            return res.status(401).json({ message: "Orden no encontrado" });
        };

        //Validar que no este facturado
        if(ticket.facturado){
            return res.status(401).json({ message: "Orden ya facturada" });
        };

        await TicketGarage.findByIdAndUpdate(ticket._id,{
            terminado: !ticket.terminado,
            fechaEntrega: Date.now()
        });


        return res.status(200).send({
            status: "success",
            message: "Orden con estado cambiado",
            ticket,
            estado: !ticket.terminado,
            entrga: ticket.fechaEntrega
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
    createTicket,
    agregarTrabajoTicket,
    deleteTrabajoTicket,
    getAllTicketGarage,
    agregarTrabajadorTicket,
    deleteTrabajadorTicket,
    getTicketGarageId,
    getDetalleOrden,
    terminarTicketOrden
}