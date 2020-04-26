const API_KEY = '2abbf7c3-245b-404f-9473-ade729ed4653'

function apiMiddleware(request, response, next) {
  const authHeader = request.headers.authorization
  const authQueryParam = request.query['apiKey']
  const authCustomQueryParam = request.headers['book-api-key']

  if (!authHeader && !authQueryParam && !authCustomQueryParam) {
    return response.status(401).send('You must specify an api key in the auth header, book-api-key header or as a query param.')
  }

  const headerTokenIsValid = authHeader && authHeader.indexOf(API_KEY) != -1
  const queryParamTokenIsValid = authQueryParam === API_KEY
  const queryCustomParamTokenIsValid = authCustomQueryParam === API_KEY

  if (headerTokenIsValid || queryParamTokenIsValid || queryCustomParamTokenIsValid) {
    next()
    return
  }



  return response.status(401).send('You must specify an api key in the auth header, book-api-key header or as a query param.')
}

module.exports = {
  apiMiddleware,
}
