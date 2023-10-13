const { Schema, model, Types } = require("mongoose");

const ticketGarageSchema = new Schema({
    orden: {
        type: Number,
        default: 1, // Empieza en 0 por defecto
    },
    carId: {
        type: Types.ObjectId,
        ref: 'Car',
        required: true
    },
    observacionRecepcion: {
        type: String,
        required: true,
        maxlength: 300
    },
    km:{
        type: Number,
        require: true
    },
    terminado: {
        type: Boolean,
        default: false
    },
    observacionEntrega: {
        type: String,
        maxlength: 300
    },
    fechaEntrega: {
        type: Date
    },
    trabajoId: [{
        type: Types.ObjectId,
        ref: 'Trabajo'
    }],
    facturado: {
        type: Boolean,
        default: false
    },
    trabajadorId: [{
        type: Types.ObjectId,
        ref: 'Trabajador'
    }]
}, {
    timestamps: true
});

// Middleware para asignar el valor de "orden" antes de guardar un nuevo documento
ticketGarageSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Consultar el número máximo de "orden" en la colección y agregar 1
        const maxOrden = await this.constructor.findOne({}, 'orden', { sort: { orden: -1 } });
        this.orden = maxOrden ? maxOrden.orden + 1 : 1;
    }
    next();
});

const TicketGarage = model("TicketGarage", ticketGarageSchema, "ticketGarages");

module.exports = TicketGarage;