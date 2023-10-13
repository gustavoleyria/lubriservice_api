const { Schema, model } = require("mongoose");

const trabajadorSchema = new Schema({
    nombre: {
        type: String,        
        maxlength: 20,
        required: true
    },
    apellido: {
        type: String,        
        maxlength: 20,
        required: true
    },
    dni: {
        type: String,        
        maxlength: 8,
        required: true,
        unique: true
    },
    especialidad: {
        type: String,
        enum: ["MECANICA_GENRAL", "FRENOS", "ELECTRICISTA", "CHAPISTA", "GOMERO", "AYUDANTE"],
        default: "AYUDANTE"
    },
    sueldo_mensual: {
        type: Number, // Cambiar a Number en lugar de Float64Array
        required: true
    },
    costo_hora: {
        type: Number, // Cambiar a Number en lugar de Float64Array
        required: true,
        default: 0
    },
    activo: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now,
      }});

trabajadorSchema.pre("save", function (next) {
    this.costo_hora = this.sueldo_mensual / (25 * 8); // Calcular costo_hora
    next();
});

const Trabajador = model("Trabajador", trabajadorSchema, "trabajadores");

module.exports = Trabajador;
