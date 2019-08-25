const {Storage} = require('@google-cloud/storage');
const extractFrames = require('ffmpeg-extract-frames')
const shortid = require('shortid')
const extractAudio = require('ffmpeg-extract-audio')


const downloadFile = require('./downloadFile')
const path = './.tmp'

const storage = new Storage({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
})

const bucketName = 'credibot'

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

module.exports = async function getFrame(url) {
  let videoPath = await downloadFile(url, path, 'mp4')
  let uuid = shortid.generate()
  let framePath = `${uuid}.jpg`
  // let audioPath = `${uuid}.ogg`
  
  await extractFrames({
    input: videoPath,
    output: framePath,
    offsets: [1000]
  })

  // await extractAudio({
  //   input: videoPath,
  //   output: audioPath
  // })
  // await saveToCloud(audioPath)

  let urlFile = await saveToCloud(framePath)

  return urlFile
}
