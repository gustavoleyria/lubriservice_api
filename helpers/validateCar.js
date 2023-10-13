const validator = require("validator");

const validateCar = (params) => {
    let resultado = false;

    let patente = !validator.isEmpty(params.patente) &&
        validator.isLength(params.patente, { max: 15 });

    let year = !validator.isEmpty(params.year.toString()) &&
        validator.isInt(params.year.toString(), { min: 1900, max: new Date().getFullYear() });

    let modelo = !validator.isEmpty(params.modelo) &&
        validator.isLength(params.modelo, { max: 40 });

    let marca = !validator.isEmpty(params.marca) &&
        validator.isLength(params.marca, { max: 15 });

    let color = !validator.isEmpty(params.color) &&
        validator.isLength(params.color, { max: 15 });

    let tipo = !validator.isEmpty(params.tipo) &&
        ["auto", "camioneta", "furgon", "camion"].includes(params.tipo);

    let rodado = !validator.isEmpty(params.rodado) &&
        validator.isLength(params.rodado, { max: 10 });
    
    let userId = !validator.isEmpty(params.userId);

    if (!patente) {
        throw new Error("Patente esta vacía o no es válida");
    } else if (!year) {
        throw new Error("Año esta vacía o no es válido");
    } else if (!modelo) {
        throw new Error("Modelo esta vacía o no es válido");
    } else if (!marca) {
        throw new Error("Marca esta vacía o no es válida");
    } else if (!color) {
        throw new Error("Color esta vacía o no es válido");
    } else if (!tipo) {
        throw new Error("Tipo esta vacía o no es válido");
    } else if (!rodado) {
        throw new Error("Rodado esta vacía o no es válido");
    } else if (!userId) {
        throw new Error("Usuario esta vacío");
    }else {
        console.log("Validación correcta");
        resultado = true;
    }

    return resultado;
}

module.exports = validateCar;