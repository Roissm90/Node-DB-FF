const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const personajeSchema = new Schema(
    {
        name: {type: String, required: true},
        age: {type: Number, required: true},
        info: {type: String, required: true},
        turbo: {type: String, required: true},
        picture: {type: String}
    },
    {
        timestamps: true
    }
);

const Personaje = mongoose.model('Personaje', personajeSchema);
module.exports = Personaje;