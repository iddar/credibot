const flatten = require('flat')
const extractFrames = require('ffmpeg-extract-frames')

const parseINE = require('./parseINE')
const save = require("./saveMedia")

const verification = 'super-cat-serial'

function getValueFromTag(obj, filter) {
  let flat = flatten(obj)
  let keys = Object.keys(flat)

  let [key] = keys.filter(key => key.includes(filter))

  return flat[key]
}

async function onType(user, type, body) {
  switch (type) {
    case 'location':
      let lat = getValueFromTag(body, 'coordinates.lat')
      let long = getValueFromTag(body, 'coordinates.long')
      console.log(save.location(user, {location: {lat, long}}))
      break;
    case 'video':
        let video = getValueFromTag(body, 'payload.url')
        console.log(save.video(user, {video}))
      break;
    case 'image':
        let ine = getValueFromTag(body, 'payload.url')
        console.log(save.video(user, {ine}))
      break;
  
    default:
      break;
  }
}

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
    let type = getValueFromTag(ctx.request.body, 'type')
    let user = getValueFromTag(ctx.request.body, 'sender.id')
    onType(user, type, ctx.request.body)
  })
  
  router.post('/resume', async (ctx, next) => {
    ctx.body = 'ok'
    await next() // end request
    let user = getValueFromTag(ctx.request.body, 'messenger user id')
    console.warn(save.getUserDate(user))
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
