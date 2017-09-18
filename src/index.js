const BinaryServer = require('binaryjs').BinaryServer
const mongojs = require('mongojs')
const fs = require('fs')
const path = require('path')
const channelModel = require('./models/channel')

const port = process.env.PORT || 9001
const binaryServer = BinaryServer({port})
const audioPath = path.join(__dirname, '../audio')

binaryServer.on('connection', function(client) {
  console.log('new binary connection')

  client.on('stream', function(stream, meta) {
    console.log('New BINARY stream:', meta)
    const data = JSON.parse(meta)
    const file = `${audioPath}/${data.channel}/${data.id}.webm`
    const fileWriter = fs.createWriteStream(file)
    stream.pipe(fileWriter)

    stream.on('end', function() {
      fileWriter.end()
      console.log('File written OK:', file)
      data.src = `/audio/${data.channel}/${data.id}.webm`

      // Save new button in db.
      channelModel.addButton(data, (err, response) => {
        console.log('DB: Saved OK!', response)
      })
    })
  })
})
