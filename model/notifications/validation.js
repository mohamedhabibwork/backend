const Joi=require('@hapi/joi');
exports.notificationData=(data)=>{
     let schema=Joi.object({
         title:Joi.string().min(3).optional(),
         type:Joi.number().optional(),
         message:Joi.string().min(3).optional()
     });
     return schema.validate(data);
 };
exports.notificationUpdateData=(data)=>{
    let schema=Joi.object({
        title:Joi.string().min(3).optional(),
        type:Joi.number().optional(),
        message:Joi.string().min(3).optional()
    });
    return schema.validate(data);
};
