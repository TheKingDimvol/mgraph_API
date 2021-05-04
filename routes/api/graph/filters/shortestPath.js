const jsonifier = require('../../../../jsonifier')


exports.get = async (req, res) => {
    let answer = {}

    let checkForError = await req.neo4j.read(`MATCH (n {id:${req.query.start}}), (m {id:${req.query.end}}), p=shortestPath((n)-[*]->(m)) RETURN nodes(p) AS nodes, relationships(p) AS edges`)
        .then(response => {
            let nodes = []
            let edges = []

            response.records[0].get('nodes').map(record => {
                let node = jsonifier(record)
                if (node) nodes.push(node)
            })
            
            response.records[0].get('edges').map(record => {
                let edge = jsonifier(record, false)
                if (edge) edges.push(edge)
            })

            answer.nodes = nodes
            answer.edges = edges
        })
        .catch(error => {
            console.log(error)
            return error
        })

    if (checkForError) {
        res.status(400).json({error: checkForError})
        return
    }

    res.json(answer)
}