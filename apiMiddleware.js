const API_KEY = '2abbf7c3-245b-404f-9473-ade729ed4653'

function apiMiddleware(request, response, next) {
  const authHeader = request.headers.authorization
  const authQueryParam = request.query['apiKey']

  if (!authHeader && !authQueryParam) {
    return response.status(401).send('unauthorized')
  }

  const token = authHeader && authHeader.contains(API_KEY)
  const headerTokenIsValid = token === API_KEY
  const queryParamTokenIsValid = authQueryParam === API_KEY

  if (headerTokenIsValid || queryParamTokenIsValid) {
    next()
    return
  }



  return response.status(401).send('unauthorized')
}

module.exports = {
  apiMiddleware,
}
