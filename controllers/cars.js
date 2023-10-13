//Importaciones
const bcrypt = require("bcrypt");
const User = require('../models/users');
const Cars = require('../models/cars');
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
        message: "Mensaje enviado desde ./controllers/cars.js"
    });
}

//Dar de alta un auto
const carRegister = async(req,res)=>{
    const { patente, year, modelo, marca, color, tipo, rodado, userId } = req.body;
    const { id } = req.params; // Aquí recibes el ID del generador de la acción
  
    try {
      // Buscar al usuario por su ID
      const user = await User.findById(id);

      //Ver si vehículo existe
      const carReg = await Cars.find({patente});
      console.log(carReg.length);

      if(carReg.length >= 1){
        return res.status(403).json({ message: "Vehículo Existente" });
      } 
      
  
      if (!user || user.role !== "OPERADOR" || !user.active) {
        if(!user || user.role !== "MANAGER" ||!user.active)
        return res.status(403).json({ message: "Acceso no autorizado" });
      }
      
      //Validar datos de entrada
      validateCar({patente, year, modelo, marca, color, tipo, rodado, userId});
  
      // Crear el objeto carro con los datos proporcionados
      const carData = {
        patente,
        year,
        modelo,
        marca,
        color,
        userId,
        tipo,
        rodado
      };
  
      // Crear el carro en la base de datos
      const car = await Cars.create(carData);

      //Buscar usuario
      const userCar = await User.findById(userId)

      // Enviar correo electrónico de verificación
      const mailOptions = {
        from: `${mail}`, // Dirección de correo electrónico del remitente
        to: userCar.email, // Dirección de correo electrónico del destinatario (puede ser newUser.email)
        subject: "Se registró tu vehículo en LubriService",
        html: `
            <h1>Muchas gracias por dejar tu vehículo en LubriService</h1>
            <p>Tu patente es ${patente} y tu cel es: ${userCar.cellphone}</p>
            <p>Por cualquier consulta y/o sigerencia podes contactarte al +5493885063909</p>
            <h3>Esperamos que tengas una buena experiencia</h3>
        `,
        };

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: mail, // Coloca aquí tu dirección de correo electrónico de Gmail
          pass: mailpass, // Coloca aquí tu contraseña de Gmail
        },
      });

    await transporter.sendMail(mailOptions);
  
      return res.status(201).json({ message: "Vehículo registrado exitosamente", car });
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  };

//Actualizar datos
const updateCar = async (req, res) => {
    const { patente, year, modelo, marca, color, tipo, rodado, userId } = req.body;
    const { id, patenteUpdate } = req.params; // Aquí recibes el ID del generador de la acción

    try {
        // Buscar al usuario por su ID
        const user = await User.findById(id);

        if (!user || (user.role !== "OPERADOR" && user.role !== "MANAGER") || !user.active) {
            return res.status(403).json({ message: "Acceso no autorizado" });
        }

        // Validar datos de entrada
        validateCar({ patente, year, modelo, marca, color, tipo, rodado, userId });

        // Buscar el vehículo por su patente
        const car = await Cars.findOne({ patente: patenteUpdate });

        if (!car) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        // Actualizar los datos del vehículo
        car.patente = patente;
        car.year = year;
        car.modelo = modelo;
        car.marca = marca;
        car.color = color;
        car.tipo = tipo;
        car.rodado = rodado;
        await car.save();

        return res.status(200).json({ message: "Vehículo actualizado exitosamente", car });
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

//Obtener autos
const getCars = async (req, res) => {
    const { id } = req.params;

    try {
        //Verificar usuario y rol
        const user = await User.findById(id);

        if(!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        } 
        if(user.role !== "OPERADOR" && user.role !== "MANAGER"){
            return res.status(401).json({ message: "Usuario no autorizado" });
        } 

        //Obtener listado de cars
        const cars = await Cars.find();
        if(!cars) {
            return res.status(401).json({ message: "No hay vehículos registrados" });
        } 

        return res.status(200).json({ message: "Listado de vehículos", cars });
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }    
}

//Obtener un auto
const getCar = async (req, res) => {
    const { id, patente } = req.params;

    try {
        //Verificar usuario y rol
        const user = await User.findById(id);

        if(!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        } 
        if(user.role !== "OPERADOR" && user.role !== "MANAGER"){
            return res.status(401).json({ message: "Usuario no autorizado" });
        } 

        //Obtener listado de cars
        const car = await Cars.find({patente});
        if(!car) {
            return res.status(401).json({ message: "No hay vehículo registrado" });
        } 

        return res.status(200).json({ message: "Detale del vehículo", car });
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }    
}


//Exportar acciones
module.exports = {
    prueba,
    carRegister,
    updateCar,
    getCars,
    getCar
}