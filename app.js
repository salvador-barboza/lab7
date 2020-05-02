const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { apiMiddleware } = require('./apiMiddleware')
const { BookStore } = require('./data/bookstore')
const { initialize } = require('./data/dbinitialization')

const app = express()
app.use(bodyParser.json())
app.use(morgan('common'))
app.use(apiMiddleware)

app.get('/bookmarks', async (request, response) => {
  const books = await BookStore.getAllBooks()
  if (books.length < 1) {
    return response.send(404).send("no bookmarks found")
  } else {
    return response.json({ books })
  }
})

app.get('/bookmark', async (request, response) => {
  const titleQueryParam = request.query['title']

  if (titleQueryParam != undefined) {
    if (titleQueryParam.length === 0) {
      return response.sendStatus(406)
    } else {
      const books = await BookStore.getBooksByTitle(titleQueryParam)
      if (books.length < 1) {
        return response.send(404).send("no bookmarks found")
      } else {
        return response.json({ books })
      }
    }
  }
})

app.post('/bookmarks', async (request, response) => {
  const { title, description, url, rating } = request.body
  if (!title || !description || !url || !rating) {
    return response.status(406).send("you must specify a title, description, url and rating to create a bookmark.")
  }

  try {
    const book = await BookStore.addBook({ title, description, url, rating })
    return response.status(201).json({ book })
  } catch {
    return response.status(400).send('there is an error in the request parameters')
  }
})

app.delete('/bookmark/:id', async (request, response) => {
  if (await BookStore.getBooksById(request.params.id).length < 1) {
    return response.status(404).send('this bookmark does not exist')
  }

  await BookStore.deleteBook(request.params.id)
  return response.sendStatus(200)
})

app.patch('/bookmark/:id', async (request, response) => {
  const { id, title, description, url, rating } = request.body
  if (!id) {
    return response.status(406).send('you must specify the id of the bookmark you want to update')
  }
  if (id != request.params.id) {
    return response.status(409).send('the id in the body and in the path must match')
  }

  if (await BookStore.getBooksById(request.params.id).length < 1) {
    return response.status(404).send('this bookmark does not exist')
  }

  try {
    const updatedBook = await BookStore.updateBook(id, { title, description, url, rating })
    return response.status(202).json({ book: updatedBook })
  } catch {
    return response.status(400).send('there is an error in the request parameters')
  }
})

app.listen(3000, async () => {
  await initialize()
  console.log('server is listening in port 3000')
})