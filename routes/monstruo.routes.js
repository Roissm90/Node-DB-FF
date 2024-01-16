const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Monstruo = require('../models/Monstruo');
const {isAuthenticated} = require('../middleware/auth.middleware');
const {upload} = require('../middleware/file.middleware');
const {uploadToCloudinary} = require('../middleware/file.middleware');

router.get('/', async (req, res, next) => {
    try {
        const monsters = await Monstruo.find().populate('weak').populate('hability');
        return res.status(200).json(monsters)
    }
    catch (err) {
        //return res.status(500).json(err)
        next(err)
    }
})

router.post('/', [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
        const monstruoPicture = req.file_url ? req.file_url : null; //req.file.path
        console.log(req.body)
        const newMonstruo = new Monstruo({
            name: req.body.name,
            info: req.body.info,
            hability: req.body.hability,
            weak: req.body.weak,
            picture: monstruoPicture
        });
        const createdMonstruo = await newMonstruo.save();

        console.log(newMonstruo);
        res.status(201).json(createdMonstruo)
    }
    catch (err) {
        next(err)
    }
})

router.put('/agregar-magias', async (req, res, next) => {
    try {
        const monstruoId = req.body.monstruoId; 
        const debilidadId = req.body.debilidadId;
        const updatedMonstruo = await Monstruo.findByIdAndUpdate(monstruoId, {
            $addToSet: { weak: { $each: debilidadId } }
        });
        if (!updatedMonstruo) {
            return res.status(404).json({ error: 'Invocación no encontrado' });
        }
        return res.status(200).json(updatedMonstruo);
    } 
    catch (err) {
        return next(err);
    }
});

router.delete('/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        const deletedMonstruo = await Monstruo.findByIdAndDelete(id);
        console.log(deletedMonstruo);
        if (deletedMonstruo) {
            res.status(200).json(deletedMonstruo);
        } else {
            let error = new Error('Monstruo no encontrado');
            error.status = 404;
            throw error;
        }
    }
    catch (err) {
        next(err)
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        const monstruoToModify = new Monstruo(req.body);
        monstruoToModify._id = id;
        const monstruoUpdate = await Monstruo.findByIdAndUpdate(id, monstruoToModify);
        if (!monstruoUpdate) {
            let error = new Error('Monstruo no encontrado');
            error.status = 404;
            throw error;
        } else {
            //res.status(200).json(characterUpdate);//envia version antigua
            res.status(200).json(monstruoUpdate);//envia version modificada
        }
    } 
    catch (err) {
        next(err)
    }
})

module.exports = router;