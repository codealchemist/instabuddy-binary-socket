const BinaryServer = require('binaryjs').BinaryServer
const mongojs = require('mongojs')
const http = require('http')
const express = require('express')
const fs = require('fs')
const path = require('path')
const channelModel = require('./models/channel')

const app = express()
const audioPath = path.join(__dirname, '../audio')
app.use('/audio', express.static(audioPath))
const server = http.createServer(app)

const port = process.env.PORT || 9001
const bs = BinaryServer({server})

bs.on('connection', function(client) {
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

server.listen(port, () => {
  console.log(`
    INSTABUDDY BINARY SOCKET Started on port ${port}
    AUDIO PATH: ${audioPath}
  `)
})
