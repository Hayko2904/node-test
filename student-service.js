const {insert, findAll, insertOne, updateMany} = require("./query");
const fs = require("fs");
const {db} = require("./database")

module.exports.insertJson = async () => {
    (await db.listCollections().toArray()).map(async item => {
        if (item?.name !== undefined) {
            await db.dropCollection(item.name)
        }
    })

    await fs.promises.readdir('./json')
        .then(async res => {
            res.map(async json => {
                await fs.promises.readFile("./json/" + json, 'utf-8')
                    .then(item => {
                        return insert(json.replace('.json', ''), JSON.parse(item))
                    }).then(async (r) => {
                        let secondData = await findAll('second').then(r => r)
                        console.log(secondData.find(item => item.country === "Bedfordshire"))
                        await updateMany(
                            json.replace('.json', ''),
                            {'location': {$exists: true}},
                            [
                                {
                                    $set: {
                                        longitude: {$arrayElemAt: ["$location.ll", 0]},
                                        latitude: {$arrayElemAt: ["$location.ll", 1]},
                                        countStudents: {
                                            $subtract: [secondData.find(item => item.country === "$country")?.overallStudents, { $size: "$students" }]
                                        }
                                    }
                                },
                                {
                                    $unset: ["location"]
                                }
                            ]
                        )
                    })
            })
        })
}