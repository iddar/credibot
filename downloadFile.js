const fetch = require('node-fetch')
const shortid = require('shortid')
const fs = require('fs')

module.exports = async function downloadFile (url, path, ext) {
  const res = await fetch(url)
  const name = `${path}/${shortid.generate()}.${ext}`
  const fileStream = fs.createWriteStream(name)
  return new Promise((resolve, reject) => {
    res.body.pipe(fileStream)
    res.body.on("error", (err) => {
      reject(err)
    })
    fileStream.on("finish", function() {
      resolve(name)
    })
  })
}
