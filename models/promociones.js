const { Schema, model } = require("mongoose");

const promocionSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
      },
      detalle: {
        type: String,
        required: true,
        trim: true,
      },
      mes: {
        type: String,
        required: true,
        enum: [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ],
      },
      imagen: {
        type: String,
        required: true,
        trim: true,
      },
      activo:{
        type: Boolean,
        default: true
      },
      created_at: {
        type: Date,
        default: Date.now,
      }
});

const Promocion = model("Promocion", promocionSchema, "promociones");

module.exports = Promocion;
