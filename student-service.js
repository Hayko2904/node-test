const {insert, findAll, insertOne, updateMany} = require("./query");
const fs = require("fs");
const {db} = require("./database")

module.exports.insertJson = async () => {
    await db.listCollections()
        .next((err, coll) => {
            if (coll?.name !== undefined) {
                db.dropCollection(coll.name)
            }
        })

    await fs.promises.readdir('./json')
        .then(async res => {
            res.map(async json => {
                await fs.promises.readFile("./json/" + json, 'utf-8')
                    .then(item => {
                        return insert(json.replace('.json', ''), JSON.parse(item))
                    })
            })
        })
}

module.exports.updateData = async () => {
    let secondData = await findAll('second').then(r => r)
    await updateMany(
        'first',
        {'location': {$exists: true}},
        [
            {
                $set: {
                    longitude: {$arrayElemAt: ["$location.ll", 0]},
                    latitude: {$arrayElemAt: ["$location.ll", 1]},
                    countStudents: {
                        $subtract: [secondData.find(item => item.country = "$country").overallStudents, { $size: "$students" }]
                    }
                }
            },
            {
                $unset: ["location"]
            }
        ]
    )
}

module.exports.setCount = async () => {
    // let firstData = await findAll('first').then(r => r)
    // let secondData = await findAll('second').then(r => r)
    // firstData.map((item) => {
    //     let country = secondData.find(elem => elem.country === item.country)
    //     insertOne('first', {'_id': item._id}, {...item, countResult: country.overallStudents - item.students.length})
    // })
}