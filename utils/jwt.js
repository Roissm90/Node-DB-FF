const jwt = require('jsonwebtoken');

const generateSign = (id, email) => {
    const secretKey = String(process.env.JWT_KEY || 'tu_clave_secreta_predeterminada');
    return jwt.sign({ id, email }, secretKey, { expiresIn: '1h' });
};

const verifySign = (token) => {
    const secretKey = String(process.env.JWT_KEY || 'tu_clave_secreta_predeterminada');
    return jwt.verify(token, secretKey);
};

module.exports = { generateSign, verifySign };
