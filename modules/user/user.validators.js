import joi from 'joi'
export const updateProfile ={
body:joi.object().required().keys({
    firstName:joi.string().trim().messages({
        "string.empty":"fill firstName filed, shouldn't be empty",
        "string.base":"firstName must be a string",

    }),
    lastName:joi.string().trim().messages({
        "string.empty":"fill lastName filed, shouldn't be empty",
        "string.base":"lastName must be a string",

    }),
    email:joi.string().trim().email().messages({
        "string.empty":"fill email filed, shouldn't be empty",
        "string.base":"email must be a string",
        "string.email":"fill a valid email",

    }),
    password:joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.\-])[A-Za-z\d@$!%*?&.\-]{8,}$/)).messages({
        'string.pattern.base':" password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters",
        "string.empty":"fill password filed, shouldn't be empty",
        "string.base":"password must be a string",

    }) ,
    phone:joi.string().trim().messages({
        "string.empty":"fill phone filed, shouldn't be empty",
        "string.base":"phone must be a string",

    }),
    age:joi.number().positive().messages({
        "number.positive":"age must be positive",
        "number.base":"age must be a number"
    }) , 
    address:joi.string().trim().pattern(new RegExp(/(\d{1,}) [a-zA-Z0-9\s]+(\.)? [a-zA-Z]+(\,)? [A-Z]{2} [0-9]{5,6}/)).messages({
        "string.base":"address must be a string",
        "string.pattern.base":"address shouldn be as Address number(at least one number) then Street Name then City then State then  Area Code(with length of 5-6) such as: 5  street Jersey City NJ 07306 "//because heshe may put 123 just as address
    }),
    gender:joi.string().trim().lowercase().valid('female','male').messages({
        "string.base":"gender must be a string",
        "any.only":"gender must be either male or female"
    }),
}),
headers:joi.object().required().keys({
    authorization:joi.string().required().messages({
        "string.empty":"fill authorization filed, shouldn't be empty",
        "string.base":"authorization must be a string",
        "any.required":"authorization is required"
    })}).options({ allowUnknown: true })
}
export const updatePassword ={
    body:joi.object().required().keys({
        password:joi.string().required().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.\-])[A-Za-z\d@$!%*?&.\-]{8,}$/)).messages({
            'string.pattern.base':" password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters",
            "string.empty":"fill password filed, shouldn't be empty",
            "string.base":"password must be a string",
            "any.required":"password is required"
        }) ,
        oldPass:joi.string().required().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.\-])[A-Za-z\d@$!%*?&.\-]{8,}$/)).messages({
            'string.pattern.base':"old password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters",
            "string.empty":"fill old password filed, shouldn't be empty",
            "string.base":"old password must be a string",
            "any.required":"old password is required"
        }) ,
    }),
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })
}
export const blockAccount = {
    body:joi.object().required().keys({
        id:joi.string().min(24).max(24).pattern(new RegExp(/^[0-9a-fA-F]{24}$/)).required().messages({
            "string.min":"id should be 24 characters",
            "string.max":"id should be 24 characters",
            "string.pattern.base":"id should be a string of hexadecimal number",
            "any.required":"id is required"
        })
    }) ,
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })
}
export const softDeleteProfile={
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })
}