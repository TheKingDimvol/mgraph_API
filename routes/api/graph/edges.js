const router = require('express').Router();
const jsonify = require('../../../jsonifier')
const edgeController = require('../../../controllers/edges/edgeController');
const { validateGetAllEdges, validateCreateEdge, validateDeleteEdge } = require('../../../middlewares/inputValidation/edgesValidation');


router.get('/', validateGetAllEdges, (req, res) => {
    // MATCH (n)-[r]->(m)  -  выбрать все ребра 'r' от точки 'n' к точке 'm'
    // WHERE (n)<-[:subsection {type:"СОДЕРЖИТ"}]-(:Доска {title:"Типология Ядра"})  -  где Доска(req.query.desk) СОДЕРЖИТ вершину 'n'
    // return r AS edge  -  возвращаем ребро 'r' как edge
    let cypher = `MATCH (n)-[r]->(m) `
    cypher += `WHERE (n)<-[:subsection {type:"СОДЕРЖИТ"}]-(:Доска {id:${req.query.desk}}) `
    cypher += `RETURN r AS edge, n.id AS start, m.id AS end`

    req.neo4j.read(cypher)
        .then(result => {
            let edges = []
            result.records.map(record => {
                let edge = jsonify(record.get('edge'), false)

                if (!edge) return

                const start = record.get('start')
                const end = record.get('end')
                edge.start = start.low !== undefined ? start.low : start
                edge.end = end.low !== undefined ? end.low : end

                edges.push(edge)
            })
            res.json(edges)
        })
        .catch(e => {
            console.log(e)
            res.status(400).json({error: 'Что-то не так с запросом'})
        })
})

// Создание нового ребра
router.post('/', validateCreateEdge, edgeController.post)

// Получение ребра по id 
//router.get('/:id', edgeController.get)

// Удаление ребра по id начальной и конечной вершины
router.delete('/', validateDeleteEdge, edgeController.delete)

// Изменение ребра по id
//router.put('/:id', edgeController.put)


module.exports = router