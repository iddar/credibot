const {Storage} = require('@google-cloud/storage')
const shortid = require('shortid')
const sharp = require('sharp')

const downloadFile = require('./downloadFile')
const path = './.tmp'
const bucketName = 'credibot'


const storage = new Storage({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
})

async function saveToCloud (filePath) {
  await storage.bucket(bucketName)
  .upload(`${path}/${filePath}`, {
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  })

  const options = {
    version: 'v2', // defaults to 'v2' if missing.
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60, // one hour
  };

  // Get a v2 signed URL for the file
  const [url] = await storage
    .bucket(bucketName)
    .file(filePath)
    .getSignedUrl(options);

  return url
}

function crop (file) {
  let uuid = shortid.generate()
  let name = `${uuid}.jpg`
  return new Promise((resolve, reject) => {
    sharp(file)
    .resize(320, 240)
    .toFile(`${path}/${name}`, (err, info) => {
      if (err) reject(err)
      resolve(name)
      console.log({info});
    })
  })
}

async function makeCrop (url) {
  let videoPath = await downloadFile(url, path, 'jpg')
  let imgCrop = await crop(videoPath)
  let urlFile = await saveToCloud(`${imgCrop}`) 
  
  return urlFile
}

module.exports = makeCrop
