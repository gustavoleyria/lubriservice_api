const { Schema, model } = require("mongoose");

const trabajosSchema = new Schema({
    trabajo: {
        type: String,
        // enum: ["MECANICA_GENRAL", "FRENOS", "ELECTRICISTA", "CHAPISTA", "GOMERO", "AYUDANTE"],
        maxlength: 20,
        require: true,
        unique: true
    },
    detalle: {
        type: String,
        maxlength: 50,
        required: true
    },
    precio:{
        type: Number,
        require: true,
        min: 0
    },
    created_at: {
        type: Date,
        default: Date.now,
      }
});

const Trabajo = model("Trabajo", trabajosSchema, "trabajos");

module.exports = Trabajo;

