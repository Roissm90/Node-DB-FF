const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const cors = require('cors');

// Configuración CORS
const corsOptions = {
    origin: '*', // Especifica el origen permitido
    credentials: true // Habilita las credenciales (si es necesario)
};

router.use(cors(corsOptions));

// Ruta para obtener todos los usuarios
router.get('/', async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (err) {
        next(err);
    }
});

// Ruta para registro de usuarios
router.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Verifica si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }

        // Crea un nuevo usuario
        const newUser = new User({ email, password });
        await newUser.save();

        // Autenticación del nuevo usuario
        req.login(newUser, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(201).json(newUser);
        });
    } catch (err) {
        next(err);
    }
});

// Ruta para iniciar sesión
router.post('/login', (req, res, next) => {
    const done = (error, user) => {
        if (error) {
            return next(error);
        } else {
            req.login(user, (error) => {
                if (error) {
                    return next(error);
                } else {
                    return res.status(200).json(user);
                }
            });
        }
    };
    passport.authenticate('login', done)(req, res, next);
});

// Ruta para cerrar sesión
router.post('/logout', (req, res, next) => {
    if (req.user) {
        req.logout(err => {
            if (err) {
                return next(err);
            }
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                return res.status(200).json('Adiós');
            });
        });
    } else {
        return res.sendStatus(304);
    }
});

module.exports = router;
