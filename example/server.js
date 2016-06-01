var koa = require('koa')
var sassMiddleware = require('../')
var path = require('path')

var app = koa()

// use postcss middleware
app.use(sassMiddleware({
  src: path.join(__dirname, 'static'),
  publicPath: '/static/'
}))

var PORT = 8080
module.exports = app.listen(PORT, function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + PORT)
})
