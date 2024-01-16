const User = require('../models/User');

const validateEmail = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //Regex email

    return regex.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
    const regex = /^.{1,}$/;

    return regex.test(password);
};

const usedEmail = async (email) => {
    const users = await User.find({email: email});
    return users.length;
}

module.exports = {validateEmail, validatePassword, usedEmail}