const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const invocacionSchema = new Schema(
    {
        name: {type: String, required: true},
        element: {type: String, required: true},
        info: {type: String, required: true},
        relatedMagic: {type: Schema.Types.ObjectId, ref: 'Magia'},
        hability: {type: String, require: true},
        picture: {type: String, require: true}
    },
    {
        timestamps: true
    }
);

const Invocacion = mongoose.model('Invocacion', invocacionSchema);
module.exports = Invocacion;