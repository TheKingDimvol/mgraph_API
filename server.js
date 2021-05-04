const express = require('express')
const config = require('./config')

const app = express()


// BodyParser для чистого JSON
app.use(express.json())
// BodyParser для Form
app.use(express.urlencoded({extended: false}))

/*
// Функция принимает любой запрос, печатает его метод и адрес источника
// Если адрес источник это localhost, то разрешает ему воспользоваться API 
// И передает запрос дальше
app.use(function (req, res, next) {
    if (req.headers.origin && req.headers.origin.includes('127.0.0.1')) {
        // Разрешает запрос с данного адреса
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin)

        // Разрешает все методы для запроса
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true)
    }

    next()
})
*/

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
