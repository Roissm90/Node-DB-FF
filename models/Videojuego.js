const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const videojuegoSchema = new Schema(
    {
        nombre: {type: String, require: true},
        mundo: {type: String, required: true},
        personajes: [{type: Schema.Types.ObjectId, ref: 'Personaje'}],
        villanos: [{type: Schema.Types.ObjectId, ref: 'Villano'}],
        director: {type: String, required: true},
        anio: {type: Number, required: true},
        picture: {type: String, required: true},
        sinopsis: {type: String, required: true}
    },
    {
        timestamps: true
    }
)

const Videojuego = mongoose.model('videojuego', videojuegoSchema);

module.exports = Videojuego;