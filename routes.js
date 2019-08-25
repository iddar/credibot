const flatten = require('flat')
const parseINE = require('./parseINE')
const save = require("./saveMedia")
const getFrame = require("./frameFromVideo")
const send = require('./email-sender')
const makeCrop = require('./cropFile')


const verification = 'super-cat-serial'

function getValueFromTag(obj, filter) {
  let flat = flatten(obj)

  let keys = Object.keys(flat)

  let [key] = keys.filter(key => key.includes(filter))

  return flat[key]
}

// async function onType(user, type, body) {
//   switch (type) {
//     case 'location':
//       let lat = getValueFromTag(body, 'coordinates.lat')
//       let long = getValueFromTag(body, 'coordinates.long')
//       console.log(save.location(user, {location: {lat, long}}))
//       break;
//     case 'video':
//         let video = getValueFromTag(body, 'payload.url')
//         console.log(save.video(user, {video}))
//         let frame = await getFrame(video)
//         console.log(frame)
//       break;
//     case 'image':
//         let ine = getValueFromTag(body, 'payload.url')
//         console.log(save.video(user, {ine}))
//       break;

//     default:
//       break;
//   }
// }

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
    // let type = getValueFromTag(ctx.request.body, 'type')
    // let user = getValueFromTag(ctx.request.body, 'sender.id')
    // onType(user, type, ctx.request.body)
  })

  router.post('/resume', async (ctx, next) => {
    ctx.body = 'ok'
    await next() // end request
    let user = getValueFromTag(ctx.request.body, 'messenger user id')
    console.warn(save.getUserData(user))
  })

  router.post('/sample', async (ctx, next) => {
    // console.warn(JSON.stringify(
    //   flatten(ctx.request.body)
    //   , null, 2))
    let ine = ctx.request.body["INE Front"]
    let video = ctx.request.body["Video"]
    let recipt = ctx.request.body["Comprobante de domicilio"]
    let location = ctx.request.body["Ubicación actual"]

    let latlog = location.split('place/').pop()

    const response = {
      ine, video, recipt, location, latlog
    }

    ctx.body = response
    // ctx.body = {
    //   "set_attributes": { "address_doc": await parseINE(img) }
    // }

    next()

    let frame = await getFrame(video)
    let mapPic = getMap(latlog)
    let numRam = Math.floor(Math.random() * 21) + 70

    console.log({
      ...response,
      frame, mapPic, numRam
    })

    const crop = await makeCrop(ine)
    console.log({crop})

    send({
      from: 'hola@credibot.com', // Sender address
      to: 'usuario@gmail.com',         // List of recipients
      subject: 'Nueva solicitud de crédito', // Subject line,

      frame, ine, mapPic, numRam
    })
  })
}

function getMap(latlon){
  let g_key = process.env['GOOGLE_MAPS_KEY']
  let zoom = 16
  let uri = `https://maps.googleapis.com/maps/api/staticmap?center=${latlon}&zoom=${zoom}&size=400x400&key=${g_key}`
  return uri
}
