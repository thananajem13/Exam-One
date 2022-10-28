export const checkIfProfileCompletedOrNot = () => {
    return (req, res, next) => {
        console.log(req.user)
        const { _id, firstName, lastName, email, password, phone, age, address, gender } = req.user
        let arrOfUnFilledInfo = []
        if (
            checkLength(firstName)?arrOfUnFilledInfo.push("firstName"):"" &&
            checkLength(lastName)?arrOfUnFilledInfo.push("lastName"):""  &&
            checkLength(email)?arrOfUnFilledInfo.push("email"):""  &&
            checkLength(password)?arrOfUnFilledInfo.push("password"):""  &&
            checkLength(phone)?arrOfUnFilledInfo.push("phone"):""  &&
            checkLength(age)?arrOfUnFilledInfo.push("age"):""  &&
            checkLength(address)?arrOfUnFilledInfo.push("address"):""  &&
            checkLength(gender)?arrOfUnFilledInfo.push("gender"):"" 
        ) { next() } else res.status(400).json({ message: "please fill your profile information filed:",arrOfUnFilledInfo })
    }
}

const checkLength = (filed = '') => {
    return filed.length
}