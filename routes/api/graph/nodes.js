const router = require('express').Router();
const jsonify = require('../../../jsonifier')
let nodeController = require('../../../controllers/nodes/nodeController')


router.get('/', (req, res) => {
    let cypher = ''

    if (req.query.desk) {
        cypher = `MATCH (d:Доска) WHERE d.id=${req.query.desk} AND d.type<>"Типология" ` + 
                 `MATCH (n) WHERE (n)<-[:subsection {type:"СОДЕРЖИТ"}]-(d) RETURN n`
    } else {
        res.status(400).json({error: 'Укажите id доски'})
        return
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
            //console.log(e)
            res.status(400).json({error: 'Что-то не так с запросом'})
        })
})


router.post('/', nodeController.post)

router.get('/:id', nodeController.get)

router.put('/:id', nodeController.put)

router.delete('/:id', nodeController.delete)


module.exports = router