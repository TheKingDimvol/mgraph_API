const jsonifier = require('../../../../jsonifier')


exports.get = async (req, res) => {
    let answer = {}

    let checkForError = await req.neo4j.read(`MATCH p=(n {id:${req.params.node}})-[*0..${req.query.depth}]-() RETURN nodes(p) AS node, relationships(p) AS edge`)
        .then(response => {
            let nodes = []
            let edges = []

            response.records.map(record => {
                record.get('node').map(node => {
                    nodes.push(jsonifier(node))
                })
            })

            /*response.records[0].get('nodes').map(record => {
                let node = jsonifier(record)
                if (node) nodes.push(node)
            })
            
            response.records[0].get('edges').map(record => {
                let edge = jsonifier(record, false)
                if (edge) edges.push(edge)
            })*/

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

    //res.json(answer)
    res.json("В разработке...")
}