const validate = {}

validate.validateEmail=(email)=>{
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)? true : false
}

validate.validatePhone=(phone)=>{
    let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/
    return phoneRegex.test(phone)? true : false
}

validate.validateName=(name)=>{
    let nameRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return nameRegex.test(name)? true : false
}

module.exports = validate