const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const monstruoSchema = new Schema(
    {
        name: {type: String, required: true},
        info: {type: String},
        weak: {type: String},
        hability: {type: Schema.Types.ObjectId, ref: 'Magia'},
        picture: {type: String, require: true}
    },
    {
        timestamps: true
    }
);

const Monstruo = mongoose.model('Monstruo', monstruoSchema);
module.exports = Monstruo;