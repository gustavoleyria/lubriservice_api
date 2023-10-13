const validator = require("validator");

const validateFactura = (params) => {
    let resultado = { isValid: true, errors: [] };

    // Validar observacion
    if (!validator.isLength(params.observacion, { max: 300 })) {
        resultado.isValid = false;
        resultado.errors.push("La observación no debe superar los 300 caracteres.");
    }

    // Validar cliente
    if (!validator.isLength(params.cliente, { min: 1, max: 50 })) {
        resultado.isValid = false;
        resultado.errors.push("El campo cliente debe tener entre 1 y 50 caracteres.");
    }

    // Validar fecha
    if (!validator.isISO8601(params.fecha.toString())) {
        resultado.isValid = false;
        resultado.errors.push("La fecha no es válida.");
    }

    console.log(resultado);

    return resultado;
}

module.exports = validateFactura;
