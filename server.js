const express = require('express')
const config = require('./config')
const cors = require('cors')

const app = express()


// Запросы с того же сервера
app.use(cors())
// BodyParser для чистого JSON
app.use(express.json())
// BodyParser для Form
app.use(express.urlencoded({extended: false}))

// Neo4j-driver для обработки запросов связанный с базой данных
app.use((req, res, next) => {
    req.neo4j = require('./middlewares/neo4j')
    next()
})

// Все пути находятся в папке routes (index.js)
app.use(require('./routes'))


app.listen(config.server.PORT, () => {
    console.clear()
    console.log('Server started on port: ' + config.server.PORT)
})
