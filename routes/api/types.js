const router = require('express').Router();
const jsonify = require('../../jsonifier')
let typeController = require('../../controllers/nodes/typeController')


router.get('/', (req, res) => {
    let cypher = ''

    if (req.query.desk) {
        cypher = `MATCH (d:Доска) WHERE d.id=${req.query.desk} ` + 
                 `MATCH (n:Тип) WHERE (n)<-[:subsection {type:"СОДЕРЖИТ"}]-(d) RETURN n`
    } else {
        res.status(400).json({error: 'Укажите id доски'})
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


router.post('/', typeController.post)

router.get('/:id', typeController.get)

router.put('/:id', typeController.put)

router.delete('/:id', typeController.delete)


module.exports = router