const validator = require("validator");

const validateTrabajador = (params) => {
    let resultado = false;

    let nombre = !validator.isEmpty(params.nombre) &&
        validator.isLength(params.nombre, { max: 20 });

    let apellido = !validator.isEmpty(params.apellido) &&
        validator.isLength(params.apellido, { max: 20 });

    let dni = !validator.isEmpty(params.dni) &&
        validator.isLength(params.dni, { max: 8 });

    let especialidad = params.especialidad &&
        (params.especialidad === "MECANICA_GENRAL" ||
        params.especialidad === "FRENOS" ||
        params.especialidad === "ELECTRICISTA" ||
        params.especialidad === "CHAPISTA" ||
        params.especialidad === "GOMERO" ||
        params.especialidad === "AYUDANTE");
    
    let sueldo_mensual = typeof params.sueldo_mensual === "number"; // Verificar si es un número

    // let sueldo_mensual = !validator.isEmpty(params.sueldo_mensual) &&
    //     validator.isNumeric(params.sueldo_mensual);

    if (!nombre) {
        throw new Error("Nombre vacío o inválido");
    } else if (!apellido) {
        throw new Error("Apellido vacío o inválido");
    } else if (!dni) {
        throw new Error("DNI vacío o inválido");
    } else if (!especialidad) {
        throw new Error("Especialidad vacío o inválida");
    } else if (!sueldo_mensual) {
        throw new Error("Sueldo mensual vacío o inválido");
    } else {
        console.log("Validación correcta");
        resultado = true;
    }

    return resultado;
}

module.exports = validateTrabajador;
