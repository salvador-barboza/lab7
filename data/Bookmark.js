const { Schema, model } = require('mongoose')

const BookmarkSchema = Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
})

const Bookmark = model('Bookmark', BookmarkSchema)

module.exports = { Bookmark }