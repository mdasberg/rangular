var mongoose = require('mongoose');

module.exports = mongoose.model('Team', {
    teamName : String,
    participants: []
});
