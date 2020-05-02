const { Bookmark } = require('./Bookmark')

const BookStore = {
  getAllBooks: function () {
    return Bookmark.find()
  },
  getBooksByTitle: function(title) {
    return Bookmark.where("title", title)
  },
  getBooksById: function(id) {
    return Bookmark.findById(id)
  },
  addBook: function({ title, description, url, rating }) {
    return Bookmark.create({ title, description, url, rating })
  },
  deleteBook: function(id) {
    return Bookmark.deleteOne({ '_id': id })
  },
  updateBook: function(id, { title, description, url, rating }) {
    return Bookmark.updateOne({ '_id': id }, {
      [title && 'title']: title,
      [description && 'description']: description,
      [url && 'url']: url,
      [rating && 'rating']: rating,
    }).then(() => this.getBooksById(id))
  }
}

module.exports = {
  BookStore,
}