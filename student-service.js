const { insert, findAll, insertOne} = require("./query");
const fs = require("fs");

module.exports.insertJson = async () => {
    const arrJson = await fs.promises.readdir('./json')
        .then(res => res)

    for (const json of arrJson) {
        await fs.promises.readFile("./json/" + json, 'utf-8')
            .then((item) => {
                let dataLocation = JSON.parse(item).filter(({location}) => location !== undefined).map((elem) => {
                    let res = elem.location
                    delete elem.location

                    return {...elem, longitude: res?.ll[0], latitude: res?.ll[1]}
                })
                let data = dataLocation.length ? dataLocation : JSON.parse(item)
                return insert(json.replace('.json', ''), data)
            })
    }
}

module.exports.setCount = async () => {
    let firstData = await findAll('first').then(r => r)
    console.log(firstData)
    let secondData = await findAll('second').then(r => r)
    console.log(secondData)
    firstData.map((item) => {
        let country = secondData.find(elem => elem.country === item.country)
        insertOne('first', {'_id': item._id}, {...item, countResult: country.overallStudents - item.students.length})
    })
}