const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Personaje = require('../models/Personaje');
const {isAuthenticated} = require('../middleware/auth.middleware');
const {upload} = require('../middleware/file.middleware');
const {uploadToCloudinary} = require('../middleware/file.middleware');

router.get('/', async (req, res, next) => {
    try {
        const characters = await Personaje.find();
        return res.status(200).json(characters)
    }
    catch (err) {
        //return res.status(500).json(err)
        next(err)
    }
})

router.post('/',[isAuthenticated], [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
        const characterPicture = req.file_url ? req.file_url : null; //req.file.path
        console.log(req.body)
        const newCharacter = new Personaje({
            name: req.body.name,
            info: req.body.info,
            age: req.body.age,
            turbo: req.body.turbo,
            picture: characterPicture
        });
        const createdCharacter = await newCharacter.save();

        console.log(newCharacter);
        res.status(201).json(createdCharacter)
    }
    catch (err) {
        next(err)
    }
})

router.delete('/:id', [isAuthenticated], async(req, res, next) => {
    try {
        const id = req.params.id;
        const deletedCharacter = await Personaje.findByIdAndDelete(id);
        console.log(deletedCharacter);
        if (deletedCharacter) {
            res.status(200).json(deletedCharacter);
        } else {
            let error = new Error('Personaje no encontrado');
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
        const personajeModify = new Personaje(req.body);
        personajeModify._id = id;
        const personajeUpdate = await Personaje.findByIdAndUpdate(id, personajeModify);
        if (!personajeUpdate) {
            let error = new Error('Personaje no encontrado');
            error.status = 404;
            throw error;
        } else {
            //res.status(200).json(characterUpdate);//envia version antigua
            res.status(200).json(personajeUpdate);//envia version modificada
        }
    } 
    catch (err) {
        next(err)
    }
})

module.exports = router;