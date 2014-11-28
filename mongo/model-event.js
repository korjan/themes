var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var eventSchema = new Schema({
    id    : ObjectId,
    name: String,
    audio: Buffer,
    filename: String
});


var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
