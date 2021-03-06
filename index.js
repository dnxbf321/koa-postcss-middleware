var path = require('path')
var url = require('url')
var fs = require('fs')
var postcss = require('postcss')
var precss = require('precss')
var autoprefixer = require('autoprefixer')
var extend = require('extend')

function middleware(options) {
  options = extend(true, {
    src: process.cwd,
    publicPath: '',
    autoprefixer: {
      browsers: ['last 2 versions', '> 5%', 'safari >= 5', 'ie >= 8', 'opera >= 12', 'Firefox ESR', 'iOS >= 6', 'android >= 4']
    }
  }, options)

  return function*(next) {
    var ctx = this
    if (this.req.method !== 'GET' && this.req.method !== 'HEAD') {
      return yield next
    }
    if (!/\.css/.test(this.req.url)) {
      return yield next
    }

    this.res.writeHead(200, {
      'Content-Type': 'text/css',
      'Cache-Control': 'max-age=0'
    })

    var reqUrl = url.parse(this.req.url, true, true)
    var relativePath = path.relative(options.publicPath, reqUrl.pathname)
    var fsLocation = path.join(options.src, relativePath)

    var source = fs.readFileSync(fsLocation)

    postcss([
      precss({}),
      autoprefixer(options.autoprefixer)
    ])
      .process(source.toString(), {
        from: fsLocation,
        map: 'inline'
      })
      .then(function(result) {
        ctx.res.end(result.css)
      })
      .catch(function(err) {
        console.error(err)
      })
  }
}

module.exports = middleware
