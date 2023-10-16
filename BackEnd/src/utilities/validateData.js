const validate = {}

validate.validateEmail=(email)=>{
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email)? true : false
}

validate.validatePhone=(phone)=>{
    let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    return phoneRegex.test(phone)? true : false
}

validate.validateName=(name)=>{
    let nameRegex = /^[A-Za-z\s'\-]+$/;
    return nameRegex.test(name)? true : false
}

validate.validateTime=(time)=>{
    let timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time)? true : false
}

validate.validateXss=(data)=>{
    let dataRegex = /^[^<>&'"]*$/;
    return dataRegex.test(data)? true : false
}

module.exports = validate