const { v4 } = require('uuid')

const BookStore = {
  books: [],
  getAllBooks: function () {
    return this.books
  },
  getBooksByTitle: function(title) {
    return this.books.filter(b => b.title === title)
  },
  getBooksById: function(id) {
    return this.books.filter(b => b.id === id)
  },
  addBook: function(book = { title, description, url, rating }) {
    const bookMark = {
      ...book,
      id: v4(),
    }

    this.books.push(bookMark)
    return bookMark
  },
  deleteBook: function(id) {
    this.books = this.books.filter(b => b.id != id)
  },
  updateBook: function(id, { title, description, url, rating }) {
    let updatedBook = { }
    this.books = this.books.map(b => {
      if (b.id === id) {
        updatedBook = {...b,
          [title && 'title']: title,
          [description && 'description']: description,
          [url && 'url']: url,
          [rating && 'rating']: rating,
        }
        return updatedBook
      } else {
        return b
      }
    })

    return updatedBook
  }
}

BookStore.addBook({
  title: 'The Pragmatic Programmer',
  description: 'The Pragmatic Programmer: From Journeyman to Master is a book about computer programming and software engineering, written by Andrew Hunt and David Thomas and published in October 1999. and it is used as a textbook in related university courses. It was the first in a series of books under the label The Pragmatic Bookshelf',
  url: 'https://pragprog.com/book/tpp/the-pragmatic-programmer',
  rating: 5
})
BookStore.addBook({
  title: 'The Rosie Project',
  description: "The Rosie Project is a 2013 Australian novel and the debut novel of Australian novelist Graeme Simsion. The novel centers on genetics professor Don Tillman, who struggles to have a serious relationship with women. With a friend's help, he devises a questionnaire to assess the suitability of female partners.",
  url: 'https://www.goodreads.com/book/show/16181775-the-rosie-project',
  rating: 5
})

module.exports = {
  BookStore,
}