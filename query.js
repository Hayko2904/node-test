const { db } = require("./database")

module.exports.insert = (collection, data) => {
    return db.collection(collection).insertMany(data)
}

module.exports.findAll = (collection) => {
    return db.collection(collection).find({}).toArray()
}

module.exports.insertOne = (collection, filter, data) => {
    db.collection('first').updateOne(filter, {$set: data}, { upsert: true })
}