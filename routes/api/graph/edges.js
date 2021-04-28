const router = require('express').Router();
const jsonify = require('../../../jsonifier')
const edgeController = require('../../../controllers/edges/edgeController')


router.get('/', (req, res) => {
    let cypher = ''

    if (req.query.desk) {
        // MATCH (n)-[r]->(m)  -  выбрать все ребра 'r' от точки 'n' к точке 'm'
        // WHERE (n)<-[:subsection {type:"СОДЕРЖИТ"}]-(:Доска {title:"Типология Ядра"})  -  где Доска(req.query.desk) СОДЕРЖИТ вершину 'n'
        // return r AS edge  -  возвращаем ребро 'r' как edge
        cypher = `MATCH (n)-[r]->(m) ` +
                 `WHERE (n)<-[:subsection {type:"СОДЕРЖИТ"}]-(:Доска {id:${req.query.desk}}) ` +
                 `RETURN r AS edge`
    } else {
        res.status(400).json({error: 'Укажите id доски'})
    }

    req.neo4j.read(cypher)
        .then(result => {
            let edges = []
            result.records.map(record => {
                let edge = jsonify(record.get('edge'), false)
                if (edge) edges.push(edge)
            })
            res.json(edges)
        })
        .catch(e => {
            console.log(e)
            res.status(400).json({error: 'Что-то не так с запросом'})
        })
})

// Создание нового ребра
router.post('/', edgeController.post)

// Получение ребра по id 
//router.get('/:id', edgeController.get)

// Удаление ребра по id начальной и конечной вершины
router.delete('/', edgeController.delete)

// Изменение ребра по id
//router.put('/:id', edgeController.put)


module.exports = router