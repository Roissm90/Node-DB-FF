const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Trabajo = require('../models/Trabajo');
const {isAuthenticated} = require('../middleware/auth.middleware');
const {upload} = require('../middleware/file.middleware');
const {uploadToCloudinary} = require('../middleware/file.middleware');

router.get('/', async (req, res, next) => {
    try {
        const trabajos = await Trabajo.find().populate('personajesAsociados');
        return res.status(200).json(trabajos);
    }
    catch (err) {
        next(err)
    }
})

router.post('/', [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
        console.log(req.body)
        const newTrabajo = new Trabajo({
            trabajo: req.body.trabajo,
            personajesAsociados: req.body.personajesAsociados,
            tecnicas: req.body.tecnicas,
            descripcion: req.body.descripcion
        });
        const createdTrabajo = await newTrabajo.save();

        console.log(newTrabajo);
        res.status(201).json(createdTrabajo)
    }
    catch (err) {
        next(err)
    }
})

router.put('/agregar-personajes-job-array', async (req, res, next) => {
    try {
        const trabajoId = req.body.trabajoId; 
        const personajesIdArray = req.body.personajesIdArray;
        const updatedTrabajo = await Trabajo.findByIdAndUpdate(trabajoId, {
            $addToSet: { personajesAsociados: { $each: personajesIdArray } }
        });
        if (!updatedTrabajo) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }
        return res.status(200).json(updatedTrabajo);
    } 
    catch (err) {
        return next(err);
    }
});

module.exports = router;