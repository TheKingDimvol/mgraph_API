const jsonify = require('../../jsonifier')


exports.get = (req, res) => {
    req.neo4j.read(`MATCH (n:Тип) WHERE n.id=${req.params.id} RETURN n`)
        .then(node => {
            if (!node) {
                throw new Error('Нет типа с id: ' + req.params.id)
            }
            let nodeJSON = jsonify(node.records[0].get('n'))
            res.json(nodeJSON)
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: e})
        })
}

exports.post = async (req, res) => {
    let availableId = 0

    let checkForError = await req.neo4j.read(`MATCH (p) RETURN max(p.id) AS max`)
                            .then(result => {
                                availableId = result.records[0].get('max').low
                            })
                            .catch(error => {
                                return error
                            })

    if (checkForError) {
        res.status(400).json(({error: checkForError}))
        return
    }

    req.body.properties['id'] = availableId + 1

    let cypher = `MATCH (desk:Доска {id:${req.body.deskID}}) `
    cypher += `CREATE (node:Тип $properties) `
    cypher += `CREATE (desk)-[:subsection {type:"СОДЕРЖИТ"}]->(node)`

    req.neo4j.write(cypher, {'properties': req.body.properties})
        .then(nothing => {
            res.status(200).end()
        })
        .catch(error => {
            //console.log(error)
            res.status(400).json({error: 'Ошибка в добавлении типа \n' + error})
        })
}

exports.put = (req, res) => {

}

exports.delete = (req, res) => {

}
