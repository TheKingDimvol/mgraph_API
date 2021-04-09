const express = require('express')
const config = require('./config')

const app = express()


app.use((req, res, next) => {
    req.neo4j = require('./neo4j')
    next()
})

app.use(require('./routes'))


app.listen(config.server.PORT, () => {
    console.clear()
    console.log('Server started on port: ' + config.server.PORT)
})
