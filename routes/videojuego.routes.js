const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Videojuego = require('../models/Videojuego');
const {isAuthenticated} = require('../middleware/auth.middleware');
const {upload} = require('../middleware/file.middleware');
const {uploadToCloudinary} = require('../middleware/file.middleware');

router.get('/', async (req, res, next) => {
    try {
        const videojuegos = await Videojuego.find().populate('personajes').populate('villanos');
        return res.status(200).json(videojuegos);
    }
    catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const videojuego = await Videojuego.findById(req.params.id).populate('personajes').populate('villanos');
        if (!videojuego) {
            return res.status(404).json({ message: 'Videojuego no encontrado' });
        }
        return res.status(200).json(videojuego);
    } catch (err) {
        next(err);
    }
});

router.post('/', [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
        const videojuegoPicture = req.file_url ? req.file_url : null; //req.file.path
        console.log(req.body)
        const newVideojuego = new Videojuego({
            nombre: req.body.nombre,
            mundo: req.body.mundo,
            personajes: [],
            villanos: [],
            director: req.body.director,
            anio: req.body.anio,
            picture: videojuegoPicture,
            sinopsis: req.body.sinopsis
        });
        const createdVideojuego = await newVideojuego.save();

        console.log(newVideojuego);
        res.status(201).json(createdVideojuego)
    }
    catch (err) {
        next(err)
    }
})

router.put('/agregar-personajes-array', async (req, res, next) => {
    try {
        const videojuegoId = req.body.videojuegoId; 
        const personajesIdArray = req.body.personajesIdArray;
        const updatedVideojuego = await Videojuego.findByIdAndUpdate(videojuegoId, {
            $addToSet: { personajes: { $each: personajesIdArray } }
        });
        if (!updatedVideojuego) {
            return res.status(404).json({ error: 'Videojuego no encontrado' });
        }
        return res.status(200).json(updatedVideojuego);
    } 
    catch (err) {
        return next(err);
    }
});

router.put('/agregar-villanos-array', async (req, res, next) => {
    try {
        const videojuegoId = req.body.videojuegoId; 
        const villanosIdArray = req.body.villanosIdArray;
        const updatedVideojuego = await Videojuego.findByIdAndUpdate(videojuegoId, {
            $addToSet: { villanos: { $each: villanosIdArray } }
        });
        if (!updatedVideojuego) {
            return res.status(404).json({ error: 'Videojuego no encontrado' });
        }
        return res.status(200).json(updatedVideojuego);
    } 
    catch (err) {
        return next(err);
    }
});

module.exports = router;