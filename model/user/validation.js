const Joi = require('@hapi/joi');
exports.registerValidation = (data) => {
    let schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(6).required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};
exports.loginValidation = (data) => {
    let schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(6).required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};

exports.updateUserValidation = (data) => {
    let schema = Joi.object({
        name: Joi.string().min(3).optional(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(6).optional(),
    });
    return schema.validate(data);
};

exports.addPaymentValidation = (data) => {
    let schema = Joi.object({
        name: Joi.string().min(3).required(),
        card: Joi.string().min(16).max(16).required(),
        exp: Joi.string().max(5).min(5).required(),
        cvc: Joi.string().min(3).max(3).required(),
        postal: Joi.string().min(4).max(4).required(),
    });
    return schema.validate(data);
};


//Joi.number()
//Joi.array().items(Joi.number()),