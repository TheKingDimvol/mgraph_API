const router = require('express').Router();
const jsonify = require('../../jsonifier')


router.get('/', (req, res) => {
    let cypher = 'MATCH ()-[r]->() RETURN r AS edge'

    if (req.query.desk) {
        // MATCH (n)-[r]->(m)  -  выбрать все пути 'r' от точки 'n' к точке 'm'
        // WHERE (n)<-[:subsection {type:"СОДЕРЖИТ"}]-(:Доска {title:"Типология Ядра"})  -  где Доска(req.query.desk) СОДЕРЖИТ вершину 'n'
        // return r AS edge  -  возвращаем путь 'r' как edge
        cypher = `MATCH (n)-[r]->(m) 
                WHERE (n)<-[:subsection {type:"СОДЕРЖИТ"}]-(:Доска {title:"${req.query.desk}"}) 
                RETURN r AS edge`
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
            res.status(400).json('Что-то не так с запросом')
        })
})

router.get('/:id', (req, res) => {
    req.neo4j.read(`MATCH ()-[r]->()  WHERE id(r) = ${req.params.id} RETURN r`)
        .then(record => {
            let edge = jsonify(record.records[0].get('r'), false)

            res.json(edge)
        })
        .catch(e => {
            console.log(e)
            res.status(400).json('Нет ребра с id: ' + req.params.id)
        })
})


module.exports = router