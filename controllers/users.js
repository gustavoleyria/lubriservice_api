//Importaciones
const bcrypt = require("bcrypt");
const validate = require("../helpers/validate");
const validateLogin = require("../helpers/validateLogin");
// const fs = require("fs");
// const path = require("path");
const User = require('../models/users');
const jwt = require("../helpers/jwt");
// const { isValidObjectId } = require('mongoose');
const nodemailer = require("nodemailer");
require('dotenv').config();
const secret = process.env.CLAVE_SECRETA;
const mail = process.env.MAIL;
const mailpass = process.env.MAILPASS;
const decifrar = process.env.ENCRITANDO;
const twilioNumber = process.env.TU_NUMERO_DE_TWILIO; // El número proporcionado por Twilio
const enviarMensajeWhatsApp = require('../helpers/twilio');

//Accion de prueba
const prueba = (req,res)=>{

    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde ./controllers/users.js"
    });
}

// Registro de usuario
const registerUser = async (req, res) => {
    try {
      const { email, cellphone, password, role, active } = req.body;
  
      // Validar parámetros de entrada
      validate({ email, cellphone, password, role });
  
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).send({
          status: "error",
          message: "El usuario ya está registrado",
        });
      }
  
      // Generar hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, parseInt(decifrar));
  
      // Crear nuevo usuario
      const newUser = new User({
        email,
        cellphone,
        password: hashedPassword,
        role,
        active
      });
  
      // Guardar usuario en la base de datos
      await newUser.save();

      // Enviar correo electrónico de verificación

      const mailOptions = {
        from: `${mail}`, // Dirección de correo electrónico del remitente
        to: email, // Dirección de correo electrónico del destinatario (puede ser newUser.email)
        subject: "Gracias por tu registro en LubriService",
        html: `
            <h1>Muchas gracias por registrate en LubriService</h1>
            <p>Tu email es: ${email} y tu cel es: ${cellphone}</p>
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

    // Buscar el usuario en la base de datos por su email
    const user = await User.findOne({ email });

    // Generar token de autenticación
    const token = jwt.createToken(user);

    
    // Envio de mensaje whatapp
    const nuevoUsuario = {
      email: user.email,
      cellphone: user.cellphone
    };

    const numeroDestinatario = user.cellphone; // Número de teléfono del usuario registrado
    console.log(numeroDestinatario);
    console.log(twilioNumber);

    await enviarMensajeWhatsApp(nuevoUsuario, numeroDestinatario);
    


    return res.status(200).send({
      status: "success",
      message: "Usuario registrado correctamente. Se ha enviado un correo de verificación.",
      user: user.email,
      id: user._id,
      token
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      error: error.message,
      message: "Hubo un error en general que no permitió el registro"
    });
  }
};

// Confirmar Email de usuario
const confirmEmail = async (req, res) => {
  const { email } = req.params;

  try {
    
    // Buscar al usuario por el correo electrónico
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Cambiar el estado 'active' del usuario a true
    user.active = true;
    await user.save();

     // Enviar correo electrónico de verificación

     const mailOptions = {
      from: `${mail}`, // Dirección de correo electrónico del remitente
      to: user.email, // Dirección de correo electrónico del destinatario (puede ser newUser.email)
      subject: "Correo confirmado en  Lubriservice",
      html: `
          <h1>Estimado ${user.email} su usuario esta activado en LubriService</h1>
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

    

    return res.status(200).json({ message: "Correo electrónico confirmado exitosamente" });
    
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//Logueo de usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validar datos de entrada
    validateLogin({ email, password });

    // Buscar el usuario en la base de datos por su email
    const user = await User.findOne({ email });


    // Verificar si el usuario existe
    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "El usuario no existe",
      });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).send({
        status: "error",
        message: "La contraseña es incorrecta",
      });
    }

    // Generar token de autenticación
    const token = jwt.createToken(user);

    // Enviar respuesta exitosa con el token
    return res.status(200).send({
      status: "success",
      message: "Inicio de sesión exitoso",
      user: user.email,
      id: user._id,
      token,
    });
  } catch (error) {
    setError(error.response.data.message);
    return res.status(500).send({
      status: "error",
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { idUser, email, password, cellphone, role } = req.body;

  try {

    // Buscar al usuario Admin por el id
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario Administrador no encontrado" });
    }

    // Si el rol es "MANAGER", actualizar al usuario
    if (user.role === "MANAGER"){
      // Validar parámetros de entrada
      validate({ email, cellphone, password, role });
      
      // Buscar al usuario por el correo electrónico
      const userUpdate = await User.findById(idUser);

      if (!userUpdate) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Generar hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, parseInt(decifrar));

      // Cambiar datos del usuario
      userUpdate.email = email;
      userUpdate.cellphone = cellphone;
      userUpdate.password = hashedPassword;
      userUpdate.role = role;
      await userUpdate.save();

      // Enviar correo electrónico de verificación

     const mailOptions = {
      from: `${mail}`, // Dirección de correo electrónico del remitente
      to: userUpdate.email, // Dirección de correo electrónico del destinatario (puede ser newUser.email)
      subject: "Datos actualizados en Lubriservice",
      html: `
          <h1>Estimado ${userUpdate.email} su usuario esta actualizado en LubriService</h1>
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

    return res.status(200).json({ message: "Usuario actualizado exitosamente" });

    }     
    
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Reset password usuario
const resetPassword = async (req, res) => {
  const { email} = req.body;

  console.log(email)

  try {

    // Buscar al usuario por el correo electrónico
    const user = await User.findOne({email});

    console.log(user)

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let password  = "12345Aa"

    // Generar hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, parseInt(decifrar));
    console.log(hashedPassword)

    await User.findByIdAndUpdate(
      user._id, // Aquí deberías pasar el _id directamente sin llaves
      {
        password: hashedPassword
      }
    );

    console.log(user)

      // Enviar correo electrónico de verificación

    const mailOptions = {
      from: `${mail}`, // Dirección de correo electrónico del remitente
      to: user.email, // Dirección de correo electrónico del destinatario (puede ser newUser.email)
      subject: "Reseteo de Contraseña en Lubriservice",
      html: `
          <h1>Estimado ${user.email} su usuario tiene actualizada su contraseña en LubriService</h1>
          <p>Por cualquier consulta y/o sigerencia podes contactarte al +5493885063909</p>
          <p>Su nueva congtraseña es "12345Aa"</p>
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

    return res.status(200).json({ message: "Contraseña actualizada exitosamente" });   
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//Bloquear usuario
const blockUser = async (req, res) => {
  const { id, email } = req.body;

  try {
    // Buscar al usuario Admin por el id
    const user = await User.findById(id);

    // Buscar al usuario a bloquear por el mail
    const userToBlock = await User.findOne({email});

    if (!user) {
      return res.status(404).json({ message: "Usuario Administrador no encontrado" });
    }

    if (!userToBlock) {
      return res.status(404).json({ message: "Usuario a Bloquear no encontrado" });
    }


    // Si el rol es "MANAGER", bloquear al usuario
    if (user.role === "MANAGER") {
      userToBlock.active = false;
      await userToBlock.save();

      return res.status(200).json({ message: "Usuario bloqueado exitosamente" });
    } else {
      return res.status(403).json({ message: "No tienes permisos para bloquear a este usuario" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Error interno del servidor" });
  }
  
};

//Eliminar un usuario
const deleteUser = async (req, res) => {
  const { id, email } = req.body;

  try {
    // Buscar al usuario por el id
    const user = await User.findById(id);

    const deleteUser = await User.findOne({email});

    console.log(user)
    console.log(deleteUser)

    if (!user) {
      return res.status(404).json({ message: "Usuario Administrador no encontrado" });
    }

    if (!deleteUser) {
      return res.status(404).json({ message: "Usuario a Eliminar no encontrado" });
    }
    
    // Si el rol es "MANAGER", eliminar al usuario de la base de datos
    if (user.role === "MANAGER") {
      await User.deleteOne({ email: deleteUser.email });

      return res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } else {
      return res.status(403).json({ message: "No tienes permisos para eliminar a este usuario" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Error interno del servidor" });
  }
  
};

//Obtener usuarios
const getUsers = async (req, res) => {

  const { id } = req.body;

  try {
    // Buscar al usuario por el id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }

    // Si el rol es "MANAGER" u "OPERADOR", eliminar al usuario de la base de datos
    if (user.role === "MANAGER" || user.role === "OPERADOR") {
      const users = await User.find();
      if (!users) {
        return res.status(404).json({ message: "No hay Usuarios" });
      }

      return res.status(200).json(users);
    } else {
      return res.status(403).json({ message: "No tienes permisos para obtener listado de usuarios" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Error interno del servidor" });
  }
  
};

//Obtener un usuario
const getUser = async (req, res) => {
  const { idAdmin } = req.params;

  console.log("el id del params es: ", idAdmin);

  const { id } = req.body;
  console.log("el id del consultado es: ", id);

  try {
    // Buscar al usuario por el id
    const user = await User.findById(idAdmin);
    if (!user) {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }

    // Si el rol es "MANAGER" u "OPERADOR", eliminar al usuario de la base de datos
    if (user.role === "MANAGER" || user.role === "OPERADOR") {
      const getUser = await User.findById(id);
      if (!getUser) {
        return res.status(404).json({ message: "No Existe Usuario" });
      }

      return res.status(200).json(getUser);
    } else {
      return res.status(403).json({ message: "No tienes permisos para obtener listado de usuarios" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Error interno del servidor" });
  }
  
};

//Obtener un role
const getRoleUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar al usuario por el id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }

    const role = user.role;

    return res.status(200).json(role);
  } catch (error) {
    return res.status(401).json({ message: "Error interno del servidor" });
  }
  
};



//Exportar acciones
module.exports = {
    prueba,
    registerUser,
    confirmEmail,
    resetPassword,
    loginUser,
    updateUser,
    blockUser,
    deleteUser,
    getUsers,
    getUser,
    getRoleUser
}