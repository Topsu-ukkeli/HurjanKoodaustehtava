const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const TauluSchema = new Schema({
    rivit: { type: Number, required: true },
    solut: { type: Number, required: true },
    solujenArvot: {
        type: [
            {
                value: { type: Number, required: true },
            },
        ],
        required: true,
    },
    _id: { type: ObjectId, default: ObjectId }
})
module.exports = mongoose.model('TauluModels', TauluSchema)