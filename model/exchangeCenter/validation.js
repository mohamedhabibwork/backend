const Joi=require('@hapi/joi');
exports.centerData=(data)=>{
     let schema=Joi.object().keys({
         wallet:Joi.number().min(0).required(),
         total:Joi.number().min(0).required(),
         rate:Joi.number().min(0).required(),
         currency:Joi.string().min(3).required()
     });
     return schema.validate(data);
 };

exports.centerUpdateData=(data)=>{
     let schema=Joi.object().keys({
         wallet:Joi.number().min(0).optional(),
         rate:Joi.number().min(0).optional(),
         name:Joi.string().min(3).optional()
     });
     return schema.validate(data);
 };
