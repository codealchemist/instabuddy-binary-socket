const mongojs = require('mongojs')

const connectionsMap = {
  prod: 'mongodb://5a.mongo.evennode.com:27017,5b.mongo.evennode.com:27017/0eb018ebf3cee856be57cdc2a6c3a963?replicaSet=us-5',
  dev: 'mongodb://localhost:27017/instabuddy'
}
const env = process.env.ENV || 'dev'
const connectionString = connectionsMap[env]
const db = mongojs(connectionString)
const collection = db.collection('channels')

class Channel {
  constructor (collection) {
    this.collection = collection
  }

  list () {

  }

  get (name, callback) {
    this.collection.find({name}, callback)
  }

  update (channel) {

  }

  create (channel) {

  }

  addButton ({channel, id, name, src}, callback) {
    console.log('DB: ADD BUTTON', {channel, id, name, src})
    this.collection.update(
      {name: channel},
      {
        $set: { updated: new Date() },
        $push: { buttons: {id, name, src} }
      },
      callback
    )
  }
}

const channel = new Channel(collection)
module.exports = channel
