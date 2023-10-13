const validator = require("validator");

const validate = (params) => {
    let resultado = false;

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email);
    
    let cellphone = !validator.isEmpty(params.cellphone)

    let role = !validator.isEmpty(params.role)

    let password = !validator.isEmpty(params.password) &&
    validator.isLength(params.password, { min: 5, max: 10 }) &&
    /[0-9]/.test(params.password) &&
    /[a-z]/.test(params.password) &&
    /[A-Z]/.test(params.password);


    if(!email){
        throw new Error("Email esta vacío o no es valido");
    }else if(!cellphone){
        throw new Error("Celular esta vacío");
    }else if(!role){
        throw new Error("Role esta vacío");
    }else if(!password){
        throw new Error("Password esta vacío o no es válidos. Deber tener entre 5 y 10 caracteres, incluir 1 número, 1 minúscula y 1 mayúscula como mínimo");
    }else{
        console.log("Validacion correcta");
        resultado = true;
    }

    return resultado;
}

module.exports = validate;