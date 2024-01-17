const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { validateEmail, validatePassword, usedEmail } = require('../utils/validation'); 
const { generateSign } = require('../utils/jwt');
const User = require('../models/User');
const { isAuth } = require('../middleware/auth.middleware');

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        console.log(req.body);
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log('ifuno');
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            console.log('ifdos');
            return res.status(401).json({ message: 'Invalid password' });
        }
        

        const token = generateSign(user._id, user.email);
        console.log(token);
        return res.status(200).json({ user, token });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/register', async (req, res, next) => {
    
    try {
        const newUser = new User(req.body);
        /*
        if (!validateEmail(newUser.email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        */

        if (!validatePassword(newUser.password)) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        if (await usedEmail(newUser.email) > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }
    
        newUser.password = bcrypt.hashSync(newUser.password, 10);
        console.log("Contraseña antes de cifrar:", newUser.password);
        const createdUser = await newUser.save();
        return res.status(201).json(createdUser);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/checkSession', [isAuth], async (req, res, next) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
