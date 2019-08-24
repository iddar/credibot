require('dotenv').config()

const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

const PORT = process.env.PORT || 5000

router.get('/webhook', async (ctx, next) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(PORT)
