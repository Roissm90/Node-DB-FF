const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Villano = require('../models/Villano');
const {isAuthenticated} = require('../middleware/auth.middleware');
const {upload} = require('../middleware/file.middleware');
const {uploadToCloudinary} = require('../middleware/file.middleware');

router.get('/', async (req, res, next) => {
    try {
        const villanos = await Villano.find();
        return res.status(200).json(villanos)
    }
    catch (err) {
        //return res.status(500).json(err)
        next(err)
    }
})

router.post('/', [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
        const villanoPicture = req.file_url ? req.file_url : null; //req.file.path
        console.log(req.body)
        const newVillano = new Villano({
            name: req.body.name,
            info: req.body.info,
            age: req.body.age,
            picture: villanoPicture
        });
        const createdVillano = await newVillano.save();

        console.log(newVillano);
        res.status(201).json(createdVillano)
    }
    catch (err) {
        next(err)
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        const deletedVillano = await Villano.findByIdAndDelete(id);
        console.log(deletedVillano);
        if (deletedVillano) {
            res.status(200).json(deletedVillano);
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

router.put('/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        const villanoModify = new Villano(req.body);
        villanoModify._id = id;
        const villanoUpdate = await Villano.findByIdAndUpdate(id, villanoModify);
        if (!villanoUpdate) {
            let error = new Error('Personaje no encontrado');
            error.status = 404;
            throw error;
        } else {
            //res.status(200).json(characterUpdate);//envia version antigua
            res.status(200).json(villanoUpdate);//envia version modificada
        }
    } 
    catch (err) {
        next(err)
    }
})

module.exports = router;