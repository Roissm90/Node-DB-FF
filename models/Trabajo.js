const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trabajoSchema = new Schema(
    {
        trabajo: {type: String, require: true},
        personajesAsociados: [{type: Schema.Types.ObjectId, ref: 'Personaje'}],
        tecnicas: [{type: String}, {type: String}, {type: String}, {type: String}, {type: String}, {type: String}, {type: String}, {type: String}, {type: String},],
        descripcion: {type: String, required: true}
    },
    {
        timestamps: true
    }
)

const Trabajo = mongoose.model('trabajo', trabajoSchema);

module.exports = Trabajo;