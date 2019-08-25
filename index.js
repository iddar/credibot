require('dotenv').config()

const Koa = require('koa')
const Router = require('koa-router')

const precessesMessages = require('./precessesMessages')

const app = new Koa()
const router = new Router()

const PORT = process.env.PORT || 5000

const verification = 'super-cat-serial'

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
  // console.warn(JSON.stringify(ctx.request.body, null, 2))
  let messages = messenger.parse(ctx.request.body, onAction)
  if (messages.length > 0) {
    precessesMessages(messages)
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(PORT)
