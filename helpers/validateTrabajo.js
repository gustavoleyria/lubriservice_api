const validator = require("validator");

const validateTrabajo = (params) => {
    let resultado = false;

    const { trabajo, detalle, precio } = params;

    if (!trabajo || !detalle || precio === undefined) {
        throw new Error("Faltan campos requeridos");
    }

    if (!validator.isLength(trabajo, { max: 20 })) {
        throw new Error("El campo 'trabajo' debe tener como máximo 20 caracteres");
    }

    if (!validator.isLength(detalle, { max: 50 })) {
        throw new Error("El campo 'detalle' debe tener como máximo 50 caracteres");
    }

    if (!validator.isNumeric(precio.toString())) {
        throw new Error("El campo 'precio' debe ser numérico");
    }

    if (precio < 0) {
        throw new Error("El campo 'precio' no puede ser menor a cero");
    }

    console.log("Validación correcta");
    resultado = true;

    
    return resultado;
}

module.exports = validateTrabajo;