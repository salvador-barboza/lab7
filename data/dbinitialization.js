const mongoose = require('mongoose')
const DB_NAME = 'bookmarksdb'

module.exports.initialize = function() {
  return mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
}
