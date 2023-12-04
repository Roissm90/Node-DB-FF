const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Magia = require('../models/Magia');
const {isAuthenticated} = require('../middleware/auth.middleware');
const {upload} = require('../middleware/file.middleware');
const {uploadToCloudinary} = require('../middleware/file.middleware');

router.get('/', async (req, res, next) => {
    try {
        const magics = await Magia.find();
        return res.status(200).json(magics)
    }
    catch (err) {
        //return res.status(500).json(err)
        next(err)
    }
})

router.post('/',[isAuthenticated], [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
        const newMagic = new Magia({
            name: req.body.name,
            info: req.body.info,
            type: req.body.type,
            element: req.body.element,
            variations: req.body.variations,
        });
        const createdMagic = await newMagic.save();
        console.log(newMagic);
        res.status(201).json(createdMagic)
    }
    catch (err) {
        next(err)
    }
})

router.delete('/:id', [isAuthenticated], async(req, res, next) => {
    try {
        const id = req.params.id;
        const deletedMagic = await Magia.findByIdAndDelete(id);
        console.log(deletedMagic);
        if (deletedMagic) {
            res.status(200).json(deletedMagic);
        } else {
            let error = new Error('Magia no encontrada');
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
        const magicToModify = new Magia(req.body);
        magicToModify._id = id;
        const magicUpdate = await Magia.findByIdAndUpdate(id, magicToModify);
        if (!magicUpdate) {
            let error = new Error('Magia no encontrada');
            error.status = 404;
            throw error;
        } else {
            //res.status(200).json(characterUpdate);//envia version antigua
            res.status(200).json(magicUpdate);//envia version modificada
        }
    } 
    catch (err) {
        next(err)
    }
})

module.exports = router;