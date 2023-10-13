const { Schema, model, Types } = require("mongoose");

const facturaSchema = new Schema({
    numero: {
        type: Number,
        default: 1, // Empieza en 0 por defecto
    },
    ordenId: {
        type: Types.ObjectId,
        ref: 'TicketGarage',
        required: true
    },
    observacion: {
        type: String,
        required: true,
        maxlength: 300
    },
    cliente:{
        type: String,
        require: true,
        default: "Consumidor Final"
    },
    fecha: {
        type: Date,
        require: true,
        default: Date.now()
    },
    detalles: {
        type: [{
            nombreTarea: String,
            precio: Number
        }],
        required: true,
        default: []
    },
    total:{
        type: Number,
        require: true,
        default: 0
    },
    orden:{
        type: Number,
        require: true,
        unique: true
    },
    anulada:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Middleware para asignar el valor de "orden" antes de guardar un nuevo documento
facturaSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Consultar el número máximo de "orden" en la colección y agregar 1
        const maxOrden = await this.constructor.findOne({}, 'numero', { sort: { orden: -1 } });
        this.orden = maxOrden ? maxOrden.orden + 1 : 1;
    }
    next();
});


const Factura = model("Factura", facturaSchema, "facturas");

module.exports = Factura;