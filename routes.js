const flatten = require('flat')
const extractFrames = require('ffmpeg-extract-frames')

const parseINE = require('./parseINE')
const precessesMessages = require('./precessesMessages')

const verification = 'super-cat-serial'

module.exports = function(router) {
  router.get('/', (ctx, next) => {
    ctx.body = "run"
  })
  
  router.get('/webhook', (ctx, next) => {
    if (ctx.query['hub.verify_token'] === verification) {
      ctx.body = ctx.query['hub.challenge']
    } else {
      ctx.body = 'Error, wrong validation token'
    }
  })
  
  router.post('/webhook', async (ctx, next) => {
    ctx.body = 'ok'
    await next() // end request
    console.warn(JSON.stringify(ctx.request.body, null, 2))
  })
  
  router.post('/resume', async (ctx, next) => {
    ctx.body = 'ok'
    await next() // end request
    console.warn(JSON.stringify(
      flatten(ctx.request.body)
      , null, 2))
  })
  
  router.post('/sample', async (ctx, next) => {
    console.warn(JSON.stringify(
      flatten(ctx.request.body)
      , null, 2))
    let img = ctx.request.body["INE Front"]
    
    ctx.body = {
      "set_attributes": { "address_doc": await parseINE(img) }
    }
  })
}
