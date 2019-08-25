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

function saveToCloud (filePath) {
  return storage.bucket(bucketName)
  .upload(filePath, {
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  })
}

module.exports = async function getFrame(url) {
  let videoPath = await downloadFile(url, path, 'mp4')
  let framePath = `${path}/${shortid.generate()}.jpg`
  let audioPath = `${path}/${shortid.generate()}.ogg`
  
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

  await saveToCloud(framePath)

  return framePath
}
