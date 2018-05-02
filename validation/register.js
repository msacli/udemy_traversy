const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    // data.name bizim yarattığımız is-empty ye bakılır.
    // eğer boş değilse kendisi olarak devam eder eğer boş
    // ise '' olarak boş string olarak devam ederi
    data.name =!isEmpty(data.name) ? data.name : '';
    data.email =!isEmpty(data.email) ? data.email : '';
    data.password =!isEmpty(data.password) ? data.password : '';
    // password2 confimr passowrd olacak
    data.password2 =!isEmpty(data.password2) ? data.password2 : '';

    if(!Validator.isLength(data.name, {min: 2, max: 30})) {
        errors.name ='Name must be between 2 and 30 characters'
    }

    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }
    if(!Validator.isLength(data.password, {min: 6, max:30})) {
        errors.password = 'passsword must be atleast 6 characters';
    }

    if(Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm password is required';
    }
    if(!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}