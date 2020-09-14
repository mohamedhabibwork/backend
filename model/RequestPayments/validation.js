const Joi = require('@hapi/joi');
exports.requestData = (data) => {
    let schema = Joi.object({
        amount: Joi.number().required(),
        total: Joi.number().required(),
        to: Joi.string().min(3).max(6).required(),
        from: Joi.string().min(3).max(6).required(),
        method: Joi.string().min(3).required(),
        name: Joi.string().min(3).required(),
        rate: Joi.number().min(1).required(),
        requestCase: Joi.string().optional(),
        data: Joi.object().optional(),
    });
    return schema.validate(data);
};
exports.requestUpdateData = (data) => {
    let schema = Joi.object({
        amount: Joi.number().optional(),
        total: Joi.number().optional(),
        to: Joi.string().min(3).max(6).optional(),
        from: Joi.string().min(3).max(6).optional(),
        rate: Joi.number().min(1).optional(),
        requestCase: Joi.string().optional(),
        data: Joi.object().optional(),
    });
    return schema.validate(data);
};