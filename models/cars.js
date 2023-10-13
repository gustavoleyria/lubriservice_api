const { Schema, model } = require("mongoose");

const carSchema = new Schema({
    patente: {
        type: String,
        required: true,
        unique: true
      },
    year: {
        type: Number,
        required: true
      },
    modelo: {
        type: String,
        required: true
      },
    marca: {
        type: String,
        required: true
      },
    color: {
        type: String,
        required: true
      },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    tipo: {
        type: String,
        enum: ["auto", "camioneta", "furgon", "camion"],
        required: true
      },
    rodado: {
        type: String,
        required: true
      },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

const Car = model("Car", carSchema, "cars");

module.exports = Car;
