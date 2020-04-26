const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { apiMiddleware } = require('./apiMiddleware')
const { BookStore } = require('./bookstore')

const app = express()
app.use(bodyParser.json())
app.use(morgan('common'))
app.use(apiMiddleware)

app.get('/bookmarks', (request, response) => {
  const titleQueryParam = request.query['title']

  if (titleQueryParam != undefined) {
    if (titleQueryParam.length === 0) {
      return response.sendStatus(406)
    } else {
      const books = BookStore.getBooksByTitle(titleQueryParam)
      if (books.length < 1) {
        return response.send(404).send("no bookmarks found")
      } else {
        return response.json({ books })
      }
    }
  }

  const books = BookStore.getAllBooks()
  if (books.length < 1) {
    return response.send(404).send("no bookmarks found")
  } else {
    return response.json({ books })
  }
})

app.post('/bookmarks', (request, response) => {
  const { title, description, url, rating } = request.body
  if (!title || !description || !url || !rating) {
    return response.status(406).send("you must specify a title, description, url and rating to create a bookmark.")
  }

  const book = BookStore.addBook({ title, description, url, rating })
  return response.status(201).json({ book })
})

app.delete('/bookmarks/:id', (request, response) => {
  if (BookStore.getBooksById(request.params.id).length < 1) {
    return response.status(404).send('this bookmark does not exist')
  }

  BookStore.deleteBook(request.params.id)
  return response.sendStatus(200)
})

app.patch('/bookmarks/:id', (request, response) => {
  const { id, title, description, url, rating } = request.body
  if (!id) {
    return response.status(406).send('you must specify the id of the bookmark you want to update')
  }
  if (id != request.params.id) {
    return response.status(409).send('the id in the body and in the path must match')
  }

  if (BookStore.getBooksById(request.params.id).length < 1) {
    return response.status(404).send('this bookmark does not exist')
  }

  const updatedBook = BookStore.updateBook(id, { title, description, url, rating })

  return response.status(202).json({ book: updatedBook })

})

app.listen(3000, () => console.log('server is listening in port 3000'))