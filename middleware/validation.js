const dataMethod = ['body', 'params', 'query', 'headers']
export const validation = (schema) => {

    return (req, res, next) => {
        try {
            const validationArr = []
        dataMethod.forEach(key => {
            if (schema[key]) {
                console.log(key);
                const validationResult = schema[key].validate(req[key], { abortEarly: false })
                if (validationResult?.error?.details) {
                    validationArr.push(validationResult.error.details)
                }

            }
        })
        if (validationArr.length) {
            res.json({ message: 'Validation error', err: validationArr })
        } else {
            next()
        }
        } catch (error) {
            console.log(error);
        }
        
    }
}