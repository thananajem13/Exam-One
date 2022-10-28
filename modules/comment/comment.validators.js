import joi from 'joi'
function test(){
console.log(process.env.bearerToken);
} 
test();
export const addComment = {
    
    body:joi.object().required().keys({
        commentBody:joi.string().required().messages({
            "string.empty":"fill comment body filed, shouldn't be empty",
            "string.base":"comment body must be a string",
            "any.required":"comment body is required"
        })
    }),
    params:joi.object().required().keys({
        productID:joi.string().required().min(24).max(24).pattern(new RegExp(/^[0-9a-fA-F]{24}$/)).messages({
            "string.min":"id should be 24 characters",
            "string.max":"id should be 24 characters",
            "string.pattern.base":"id should be a string of hexadecimal number",
            "any.required":"id is required"
        })
    }),
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })

    /**default
     * 
     *  headers: Joi.object({
            'accept-version': Joi.number().valid(1.0).required()
        }).options({ allowUnknown: true })
     */
}
 
export const updateComment = {
    body:joi.object().required().keys({
        commentBody:joi.string().required().messages({
            "string.empty":"fill comment body filed, shouldn't be empty",
            "string.base":"comment body must be a string",
            "any.required":"comment body is required"
        })
    }),
    params:joi.object().required().keys({
        commentID:joi.string().required().min(24).max(24).pattern(new RegExp(/^[0-9a-fA-F]{24}$/)).messages({
            "string.min":"id should be 24 characters",
            "string.max":"id should be 24 characters",
            "string.pattern.base":"id should be a string of hexadecimal number",
            "any.required":"id is required"
        })
    }),
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })
}
export const softDeleteComment = {
    params:joi.object().required().keys({
        commentID:joi.string().required().min(24).max(24).pattern(new RegExp(/^[0-9a-fA-F]{24}$/)).messages({
            "string.min":"id should be 24 characters",
            "string.max":"id should be 24 characters",
            "string.pattern.base":"id should be a string of hexadecimal number",
            "any.required":"id is required"
        })
    }),
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })
}