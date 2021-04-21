const jsonify = require('../../jsonifier')


exports.get = (req, res) => {
    req.neo4j.read(`MATCH (n:Тип) WHERE n.id=${req.params.id} RETURN n`)
        .then(node => {
            if (!node.records.length) {
                res.status(400).json({error: 'Нет типа с id: ' + req.params.id})
                return 
            }

            let nodeJSON = jsonify(node.records[0].get('n'))
            res.json(nodeJSON)
        })
        .catch(e => {
            console.log(e)
            res.status(400).json({error: e})
        })
}

exports.post = async (req, res) => {
    let availableId = 0

    let checkForError = await req.neo4j.read(`MATCH (p) RETURN max(p.id) AS max`)
                            .then(result => {
                                availableId = result.records[0].get('max')
                            })
                            .catch(error => {
                                return error
                            })

    if (checkForError) {
        res.status(400).json({error: checkForError})
        return
    }

    req.body.properties['id'] = availableId + 1

    let cypher = `MATCH (typology:Доска {id:${req.body.typology}, type:"Типология"}) `
    cypher += `CREATE (node:Тип $properties) `
    cypher += `CREATE (typology)-[:subsection {type:"СОДЕРЖИТ"}]->(node)`

    req.neo4j.write(cypher, {'properties': req.body.properties})
        .then(nothing => {
            res.status(200).end()
        })
        .catch(error => {
            //console.log(error)
            res.status(400).json({error: 'Ошибка в добавлении типа ' + error})
        })
}

exports.put = (req, res) => {

}

exports.delete = (req, res) => {
    // Нужна ли проверка на существование типа???
    req.neo4j.write(`MATCH (n:Тип) WHERE n.id=${req.params.id} DETACH DELETE n`)
        .then(nothing => {
            res.status(200).end()
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: 'Плохой запрос'})
        })
}
