const {Storage} = require('@google-cloud/storage');
const extractFrames = require('ffmpeg-extract-frames')
const shortid = require('shortid')

const downloadFile = require('./downloadFile')
const path = './.tmp'

const storage = new Storage({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
})

const bucketName = 'credibot'

module.exports = async function getFrame(url) {
  let filePath = await downloadFile(url, path, 'mp4')
  let framePath = `${path}/${shortid.generate()}.jpg`
  
  await extractFrames({
    input: filePath,
    output: framePath,
    offsets: [1000]
  })

  await storage.bucket(bucketName).upload(framePath, {
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  return framePath
}
