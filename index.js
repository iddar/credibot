
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

const PORT = process.env.PORT || 5000

require('./routes')(router)

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(PORT)
