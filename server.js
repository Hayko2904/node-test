const express = require('express')
const { insertJson, setCount } = require("./student-service");
const app = express()

const run = async function () {
    await insertJson()
    await setCount()
}

run()

app.listen(3000, () => {
    console.log('Server is running ' + 3000)
})