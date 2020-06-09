const express = require('express')
const path = require('path')

const app = express()

app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] == "http") {
        res.redirect(`https://${req.headers.host}${req.url}`)
    } else {
        next()
    }
})

app.use(express.static(__dirname + '/dist/covid19-panel'))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)

    next()
})

app.get('*', (req, res, next) => {
    console.log('sendFile')
    console.log(`dirname: ${__dirname}`)
    console.log(`dirname_full: ${__dirname + '/dist/covid19-panel/index.html'}`)
    res.sendFile(path.join(__dirname + '/dist/covid19-panel/index.html'))
})

app.listen(process.env.PORT || 3000)