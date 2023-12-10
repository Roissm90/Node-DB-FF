const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const villanoSchema = new Schema (
    {
        name: {type: String, required: true},
        age: {type: Number, required: true},
        info: {type: String, required: true},
        turbo: {type: String},
        picture: {type: String},
        juego: {type: String}
    },
    {
        timestamps: true
    }
);

    
const Villano = mongoose.model('Villano', villanoSchema);
module.exports = Villano;