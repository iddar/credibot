const extractFrames = require('ffmpeg-extract-frames')
const shortid = require('shortid')

const downloadFile = require('./downloadFile')
const path = './.tmp'

module.exports = async function getFrame(url) {
  let filePath = await downloadFile(url, path, 'mp4')
  let framePath = `${path}/${shortid.generate()}.jpg`
  
  await extractFrames({
    input: filePath,
    output: framePath,
    offsets: [1000]
  })

  return framePath
}
