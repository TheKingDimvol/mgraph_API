const router = require('express').Router();
const jsonify = require('../../jsonifier')


router.get('/', (req, res) => {
    let cypher = 'MATCH (n) RETURN n'

    if (req.query.desk) {
        cypher = `MATCH (n) WHERE (n)<-[:subsection {type:"СОДЕРЖИТ"}]-(:Доска {title:"${req.query.desk}"}) RETURN n`
    }

    req.neo4j.read(cypher)
        .then(result => {
            let nodes = []
            result.records.map(record => {
                let node = jsonify(record.get('n'))
                if (node) nodes.push(node)
            })
            res.json(nodes)
        })
        .catch(e => {
            console.log(e)
            res.status(400).json('Что-то не так с запросом')
        })
})

router.get('/:id', (req, res) => {
    req.neo4j.read(`MATCH (n) WHERE id(n) = ${req.params.id} RETURN n`)
        .then(node => {
            let nodeJSON = jsonify(node.records[0].get('n'))
            console.log('Fetched node')
            res.json(nodeJSON)
        })
        .catch(e => {
            res.status(400).json('Нет вершины с id: ' + req.params.id)
        })
})


module.exports = router