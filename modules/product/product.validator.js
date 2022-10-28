import joi from 'joi'
export const addProduct = {
    body:joi.object().required().keys({
        title:joi.string().required().messages({
            "string.empty":"fill title filed, shouldn't be empty",
            "string.base":"title must be a string",
            "any.required":"title is required"
        }),
        description:joi.string().required().messages({
            "string.empty":"fill title filed, shouldn't be empty",
            "string.base":"title must be a string",
            "any.required":"title is required"
        }),
        price:joi.number().required().positive().messages({
            "number.positive":"age must be positive",
            "number.base":"age must be a number",
            "any.required":"title is required"
        })
    }),
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })
}
export const updateProduct = {
    params:joi.object().required().keys({
        productID:joi.string().required().min(24).max(24).pattern(new RegExp(/^[0-9a-fA-F]{24}$/)).messages({
            "string.min":"id should be 24 characters",
            "string.max":"id should be 24 characters",
            "string.pattern.base":"id should be a string of hexadecimal number",
            "any.required":"id is required"
        })
    }),
    body:joi.object().required().keys({
        title:joi.string().required().messages({
            "string.empty":"fill title filed, shouldn't be empty",
        "string.base":"title must be a string",
        "any.required":"title is required"  
        }),description:joi.string().required().messages({
            "string.empty":"fill description filed, shouldn't be empty",
        "string.base":"description must be a string",
        "any.required":"description is required"  

        }),
        price:joi.number().required().positive().messages({
            "number.positive":"price must be positive",
            "number.base":"price must be a number",
            "any.required":"price is required"
        })
    }),
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })
}
export const deleteProduct = {
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
}
export const productTitleSearch = {
    body:joi.object().required().keys({
        title:joi.string().required().messages({
            "string.empty":"fill title filed, shouldn't be empty",
            "string.base":"title must be a string",
            "any.required":"title is required"
        }),
    }),
     
}