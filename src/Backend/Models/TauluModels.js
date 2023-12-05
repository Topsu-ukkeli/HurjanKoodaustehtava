const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const TauluSchema = new Schema({
    rivit: {type:String,require:false},
    solut: {type: String, require:false},
    _id: {type:ObjectId, default:ObjectId}
})
module.exports = mongoose.model('TauluModels', TauluSchema)