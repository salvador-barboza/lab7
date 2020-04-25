const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { apiMiddleware } = require('./apiMiddleware')
const { BookStore } = require('./bookstore')

const app = express()
app.use(bodyParser.json())
app.use(morgan())
app.use(apiMiddleware)

app.get('/bookmarks', (request, response) => {
  const titleQueryParam = request.query['title']

  if (titleQueryParam != undefined) {
    if (titleQueryParam.length === 0) {
      return response.sendStatus(406)
    } else {
      const books = BookStore.getBooksByTitle(titleQueryParam)
      if (books.length < 1) {
        return response.sendStatus(404)
      } else {
        return response.json({ books })
      }
    }
  }

  const books = BookStore.getAllBooks()
  if (books.length < 1) {
    return response.sendStatus(404)
  } else {
    return response.json({ books })
  }
})

app.post('/bookmarks', (request, response) => {
  const { title, description, url, rating } = request.body
  if (!title || !description || !url || !rating) {
    return response.sendStatus(406)
  }

  const book = BookStore.addBook({ title, description, url, rating })
  return response.status(201).json({ book })
})

app.delete('/bookmarks/:id', (request, response) => {
  if (BookStore.getBooksById(request.params.id).length < 1) {
    return response.sendStatus(404)
  }

  BookStore.deleteBook(request.params.id)
  return response.sendStatus(200)
})

app.patch('/bookmarks/:id', (request, response) => {
  const { id, title, description, url, rating } = request.body
  if (!id) {
    return response.sendStatus(406)
  }
  if (id != request.params.id) {
    return response.sendStatus(409)
  }

  const updatedBook = BookStore.updateBook(id, { title, description, url, rating })

  return response.status(202).json({ book: updatedBook })

})

app.listen(3000)