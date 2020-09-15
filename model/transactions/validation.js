const Joi = require('joi');
exports.transactionData = (data) => {
    let schema = Joi.object({
        formAmount: Joi.number().required(),
        toAmount: Joi.number().required(),
        to: Joi.string().optional(),
        formCurrency: Joi.string().min(3).max(10).required(),
        toCurrency: Joi.string().min(3).max(10).required(),
        name: Joi.string().optional(),
        method: Joi.string().optional(),
        requestCase: Joi.string().optional(),
        data: Joi.object().optional(),
    });
    return schema.validate(data);
};
exports.transactionUpdateData = (data) => {
    let schema = Joi.object({
        formAmount: Joi.number().optional(),
        toAmount: Joi.number().optional(),
        to: Joi.string().optional(),
        formCurrency: Joi.string().min(3).max(10).optional(),
        toCurrency: Joi.string().min(3).max(10).optional(),
        requestCase: Joi.string().optional(),
        name: Joi.string().optional(),
        method: Joi.string().optional(),
        data: Joi.object().optional(),
    });
    return schema.validate(data);
};