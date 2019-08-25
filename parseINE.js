const Vision = require('@google-cloud/vision');
const fs = require('fs')

const downloadFile =  require("./downloadFile")

const tmpPath = './.tmp'
fs.mkdirSync(tmpPath, { recursive: true })

const client = new Vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
})

async function quickstart(imgPath) {
  const [result] = await client.textDetection(imgPath);
  return result.fullTextAnnotation.text
}

module.exports = async function parseINE (img) {
  let ext = "jpg"
  let imgPath = await downloadFile(img, tmpPath, ext)
  let text = await quickstart(imgPath)

  return text
}
