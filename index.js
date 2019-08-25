
const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const fetch = require('node-fetch');
const Vision = require('@google-cloud/vision');
const shortid = require('shortid')

const precessesMessages = require('./precessesMessages')
const tmpPath = './.tmp'
fs.mkdirSync(tmpPath, { recursive: true })

const client = new Vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
})

const app = new Koa()
const router = new Router()

const PORT = process.env.PORT || 5000

const verification = 'super-cat-serial'

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

router.post('/sample', async (ctx, next) => {
  console.warn(ctx.request.body)
  let img = ctx.request.body["INE Front"]
  let imgPath = await downloadFile(img, tmpPath)
  let text = await quickstart(imgPath)

  ctx.body = {
    "set_attributes": { "address_doc": text }
  }
  await next() // end request
})

const downloadFile = async (url, path) => {
  const res = await fetch(url);
  const name = `${path}/${shortid.generate()}.jpg`
  const fileStream = fs.createWriteStream(name);
  return new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", (err) => {
        reject(err);
      });
      fileStream.on("finish", function() {
        resolve(name);
      });
    });
};

async function quickstart(imgPath) {
  const [result] = await client.textDetection(imgPath);
  return result.fullTextAnnotation.text
}

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(PORT)
