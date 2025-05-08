const validator = require('validator');

const validateAuthFields = (data) => {

    const mandatoryFields = ['firstName', 'emailId', 'password'];
    const dataField = Object.keys(data); // returns an array of keys from the data object
    const isAllowed = mandatoryFields.every((field) => dataField.includes(field));

    if(!isAllowed)
    {
        throw new Error("Field Missing");
    }
    if(!validator.isEmail(data.emailId))
    {
        throw new Error("Invalid Email");
    }
    if(!validator.isStrongPassword(data.password))
    {
        throw new Error("Weak Password");
    }
} 


module.exports = validateAuthFields;