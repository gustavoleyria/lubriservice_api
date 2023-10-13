const twilio = require('twilio');
require('dotenv').config();



// Credenciales de Twilio (reemplaza con tus propias credenciales)
const accountSid = process.env.TU_ACCOUNT_SID;
const authToken = process.env.TU_AUTH_TOKEN;
const twilioNumber = process.env.TU_NUMERO_DE_TWILIO; // El número proporcionado por Twilio

// Crear un cliente de Twilio
const client = new twilio(accountSid, authToken);

// Función para enviar mensaje de WhatsApp
async function enviarMensajeWhatsApp(datosUsuario, numeroDestinatario) {
  try {
    const mensaje = `Un nuevo usuario se ha registrado en LubriService.\n
    Su Email: ${datosUsuario.email}\n
    Su Cell: ${datosUsuario.cellphone}\n`;

    const mensajeEnviado = await client.messages.create({
      mediaUrl: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn5LLhOOfZ8Clv_n0TQsnkfHd0f_WqtZc3jw&usqp=CAU'],
      body: mensaje,
      from: `whatsapp:${twilioNumber}`,
      to: `whatsapp:${numeroDestinatario}`
    });

    console.log('Mensaje de WhatsApp enviado:', mensajeEnviado.sid);
  } catch (error) {
    console.error('Error al enviar el mensaje de WhatsApp:', error);
  }
}

//Exportar modulos
module.exports = enviarMensajeWhatsApp; // Exportar directamente la función
