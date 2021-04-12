const jsonify = require('../../jsonifier')


exports.get = (req, res) => {
    const notNodes = ['Доска', 'Тип']

    req.neo4j.read(`MATCH (n) WHERE n.id=${req.params.id} RETURN n`)
        .then(node => {
            let nodeJSON = jsonify(node.records[0].get('n'))


            if (notNodes.includes(nodeJSON.label)) {
                res.status(400).json({error: 'Нет вершины с id: ' + req.params.id})
            } else {
                res.json(nodeJSON)
            }
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: 'Нет вершины с id: ' + req.params.id})
        })
}

exports.post = async (req, res) => {
    let availableId = 0
    let community = 0
    let label = ''

    let checkForError = await req.neo4j.read(`MATCH (p) MATCH (n:Тип) WHERE n.id=${req.body.typeID} RETURN max(p.id) AS max, n.community, n.title`)
                            .then(result => {
                                availableId = result.records[0].get('max').low
                                community = result.records[0].get('n.community').low
                                label = '`' + result.records[0].get('n.title') + '`'
                            })
                            .catch(error => {
                                return "Нет типа с id: " + req.body.typeID
                            })

    if (checkForError) {
        res.status(400).json(({error: checkForError}))
        return
    }

    req.body.properties['id'] = availableId + 1
    req.body.properties['community'] = community

    let cypher = `MATCH (desk:Доска {id:${req.body.deskID}}) `
    cypher += `CREATE (node:${label} $properties) `
    cypher += `CREATE (desk)-[:subsection {type:"СОДЕРЖИТ"}]->(node)`

    req.neo4j.write(cypher, {'properties': req.body.properties})
        .then(nothing => {
            res.status(200).end()
        })
        .catch(error => {
            //console.log(error)
            res.status(400).json({error: 'Ошибка в добавлении вершины \n' + error})
        })
}

exports.put = (req, res) => {
    // Нужна ли проверка на существование вершины???
    req.neo4j.write(`MATCH (n) WHERE n.id=${req.params.id} SET n+=$properties`, {'properties': req.body})
        .then(nothing => {
            res.status(200).end()
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: 'Плохой запрос'})
        })
}

exports.delete = (req, res) => {
    // Нужна ли проверка на существование вершины???
    req.neo4j.write(`MATCH (n) WHERE n.id=${req.params.id} DETACH DELETE n`)
        .then(nothing => {
            res.status(200).end()
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: 'Плохой запрос'})
        })
}
