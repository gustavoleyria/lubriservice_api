//Importaciones
const bcrypt = require("bcrypt");
const User = require('../models/users');
const Cars = require('../models/cars');
const Trabajadores = require('../models/trabajadores');
const Trabajos = require('../models/trabajos');
const TicketGarage = require('../models/ticketGarage');
const Facturas = require('../models/facturas');
const jwt = require("../helpers/jwt");
const validateFactura = require('../helpers/validateFactura');
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
        message: "Mensaje enviado desde ./controllers/factura.js"
    });
}

//Generar una nueva factura
const createFactura = async (req,res) => {
    const { id } = req.params;
    const { ordenId, observacion, cliente, fecha } = req.body;

    try {
        //Validar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Validar datos
        validateFactura({ observacion, cliente, fecha });

        //Verificar orden
        const ticket = await TicketGarage.findById(ordenId);

        if(!ticket){
            return res.status(401).json({ message: "Ticket no encontrado" });
        };

        if(ticket.trabajoId.length < 1){
            return res.status(401).json({ message: "Ticket no tiene trabajos asignados" });
        };

        if(!ticket.terminado){
            return res.status(401).json({ message: "Los trabajos no se han terminado" });
        };

        if(ticket.facturado){
            return res.status(401).json({ message: "Los trabajos se han facturado" });
        };

        // Inicializar un arreglo vacío para almacenar los trabajos
        const detalles = [];

        // Iterar sobre los IDs en ticket.trabajoId
        for (const trabajoId of ticket.trabajoId) {
            // Buscar el trabajo correspondiente al ID actual y agregarlo al arreglo
            const trabajo = await Trabajos.findOne({ _id: trabajoId });

            if (trabajo) {
                detalles.push({
                    nombreTarea: trabajo.trabajo,
                    precio: trabajo.precio
                });
            }
            
        }

        // Calcular el total de la factura sumando los precios de los trabajos
        const total = detalles.reduce((acc, trabajo) => acc + trabajo.precio, 0);

        // Crear la factura
        const factura = new Facturas({
            ordenId,
            observacion,
            cliente,
            fecha,
            detalles,
            total,
            orden: ticket.orden
        });

        // Guardar la factura en la base de datos
        await factura.save();

        ticket.facturado = true;
        await ticket.save();

        return res.status(201).json({
            status: "success",
            message: "Factura creada correctamente.",
            factura
        });


    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Anular una factura
const anularFactura = async (req,res) => {
    const { id, idFactura } = req.params;
    //const { idFactura } = req.body;

    try {
        //Validar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Verificar factura
        const factura = await Facturas.findById(idFactura);

        if(!factura){
            return res.status(401).json({ message: "Factura no encontrada" });
        };

        if(factura.anulada){
            return res.status(401).json({ message: "Factura ya anulada" });
        };

        //Anular
        factura.anulada = true;        

        // Guardar la factura en la base de datos
        await factura.save();

        return res.status(201).json({
            status: "success",
            message: "Factura anulada correctamente.",
            factura
        });


    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Reactivar una factura
const activarFactura = async (req,res) => {
    const { id, idFactura } = req.params;
    //const { idFactura } = req.body;

    try {
        //Validar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Verificar factura
        const factura = await Facturas.findById(idFactura);

        if(!factura){
            return res.status(401).json({ message: "Factura no encontrada" });
        };

        if(!factura.anulada){
            return res.status(401).json({ message: "Factura no anulada" });
        };

        //Anular
        factura.anulada = false;        

        // Guardar la factura en la base de datos
        await factura.save();

        return res.status(201).json({
            status: "success",
            message: "Factura activada correctamente.",
            factura
        });


    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Lista de facturas
const listarFacturas = async (req,res) => {
    const { id } = req.params;

    try {
        //Validar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Verificar factura
        const facturas = await Facturas.find();

        if(!facturas){
            return res.status(401).json({ message: "Facturas no encontradas" });
        };

        return res.status(201).json({
            status: "success",
            message: "Factura activada correctamente.",
            facturas
        });


    } catch (error) {
        return res.status(500).send({
            status: "error",
            error: error.message,
            message: "Hubo un error en general que no permitió el registro"
          });
    }
}

//Lista de facturas
const listarFactura = async (req,res) => {
    const { id, idFactura } = req.params;
    //const { idFactura } = req.body;

    try {
        //Validar permisos
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({ message: "Usuario no encontrado" });
        };

        if(user.role !== "MANAGER" && user.role !== "OPERADOR"){
            return res.status(404).json({status: "error", message: "Usuario no autorizado" });
        };

        //Verificar factura
        const factura = await Facturas.findById(idFactura);
        console.log(factura)

        if(!factura){
            return res.status(401).json({ message: "Factura no encontrada" });
        };

        return res.status(201).json({
            status: "success",
            message: "Factura activada correctamente.",
            factura
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
    createFactura,
    anularFactura,
    activarFactura,
    listarFacturas,
    listarFactura
}