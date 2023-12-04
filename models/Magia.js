const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const magiaSchema = new Schema(
    {
        name: {type: String, required: true},
        element: {type: String},
        type: {type: String},
        info: {type: String, required: true},
        variations: [{type: String}, {type: String}, {type: String}, {type: String}, {type: String}],
    },
    {
        timestamps: true
    }
);

const Magia = mongoose.model('Magia', magiaSchema);
module.exports = Magia;