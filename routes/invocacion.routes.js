const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Invocacion = require('../models/Invocacion');
const {isAuthenticated} = require('../middleware/auth.middleware');
const {upload} = require('../middleware/file.middleware');
const {uploadToCloudinary} = require('../middleware/file.middleware');

router.get('/', async (req, res, next) => {
    try {
        const invocations = await Invocacion.find().populate('relatedMagic');
        return res.status(200).json(invocations)
    }
    catch (err) {
        //return res.status(500).json(err)
        next(err)
    }
})

router.post('/',[isAuthenticated], [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
        const invocationPicture = req.file_url ? req.file_url : null; //req.file.path
        console.log(req.body)
        const newInvocation = new Invocacion({
            name: req.body.name,
            info: req.body.info,
            element: req.body.element,
            hability: req.body.hability,
            relatedMagic: req.body.relatedMagic,
            picture: invocationPicture
        });
        const createdInvocation = await newInvocation.save();

        console.log(newInvocation);
        res.status(201).json(createdInvocation)
    }
    catch (err) {
        next(err)
    }
})

router.put('/agregar-magias', [isAuthenticated], async (req, res, next) => {
    try {
        const invocacionId = req.body.invocacionId; 
        const magiasIdArray = req.body.magiasIdArray;
        const updatedInvocacion = await Invocacion.findByIdAndUpdate(invocacionId, {
            $addToSet: { relatedMagic: { $each: magiasIdArray } }
        });
        if (!updatedInvocacion) {
            return res.status(404).json({ error: 'Invocación no encontrado' });
        }
        return res.status(200).json(updatedInvocacion);
    } 
    catch (err) {
        return next(err);
    }
});

router.delete('/:id', [isAuthenticated], async(req, res, next) => {
    try {
        const id = req.params.id;
        const deletedInvocation = await Invocacion.findByIdAndDelete(id);
        console.log(deletedInvocation);
        if (deletedInvocation) {
            res.status(200).json(deletedInvocation);
        } else {
            let error = new Error('Invocación no encontrada');
            error.status = 404;
            throw error;
        }
    }
    catch (err) {
        next(err)
    }
})

router.put('/:id', [isAuthenticated], async(req, res, next) => {
    try {
        const id = req.params.id;
        const invocationToModify = new Invocacion(req.body);
        invocationToModify._id = id;
        const invocationUpdate = await Invocacion.findByIdAndUpdate(id, invocationToModify);
        if (!invocationUpdate) {
            let error = new Error('Invocación no encontrada');
            error.status = 404;
            throw error;
        } else {
            //res.status(200).json(characterUpdate);//envia version antigua
            res.status(200).json(invocationUpdate);//envia version modificada
        }
    } 
    catch (err) {
        next(err)
    }
})

module.exports = router;