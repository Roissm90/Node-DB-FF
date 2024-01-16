const User = require("../models/User");
const { verifySign } = require("../utils/jwt");

const isAuth = async (req, res, next) => {
    //COMPRUEBO AUTH Y SI ES VALIDO LE DEJO PASAR A LO SIGUIENTE(next)
    try {
        const authorization = req.headers.authorization;
        if(!authorization){
            return res.status(401).json({message: 'Unauthorized'})
        }

        //Bearer ASdassa dsads asdsad --> split(' ') --> [Bearer,ASdassa,dsads,asdsad]
        const token = authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message: 'no token provided'});
        }

        let tokenVerified = verifySign(token, process.env.JWT_KEY);
        if(!tokenVerified.id){
            return res.status(401).json({message: 'token not valid'});
        }

        const userLogged = await User.findById(tokenVerified.id);
        req.user = userLogged;
        //obj = {name: "pepe", apellido: "perez"}; obj.edad = 20; --> {name: "pepe", apellido: "perez", edad: 20};

        next();

    } catch (error) {
        return res.status(500).json(error);
    }
}


const isAdmin = async (req, res, next) => {
    //COMPRUEBO AUTH Y SI ES VALIDO LE DEJO PASAR A LO SIGUIENTE(next)
    try {
        const authorization = req.headers.authorization;
        if(!authorization){
            return res.status(401).json({message: 'Unauthorized'})
        }

        //Bearer ASdassa dsads asdsad --> split(' ') --> [Bearer,ASdassa,dsads,asdsad]
        const token = authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message: 'no token provided'});
        }

        let tokenVerified = verifySign(token, process.env.JWT_KEY);
        if(!tokenVerified.id){
            return res.status(401).json({message: 'token not valid'});
        }

        const userLogged = await User.findById(tokenVerified.id);

        if(userLogged.role != 'admin'){
            return res.status(401).json({message: 'no eres administrador'});
        }

        req.user = userLogged;

        next();

    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {isAuth, isAdmin}