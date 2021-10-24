const { Schema, model } = require('mongoose');

module.exports = model('mute', new Schema({ guild: { type: String }, user: { type: String }, startDate: { type: Date }, endDate: { type: Date } }));