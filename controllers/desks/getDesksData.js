const jsonify = require("../../jsonifier")


exports.getNodes = (req, res) => {
    let cypher  = `MATCH (desk {id:${req.params.id}})-[:subsection {type:"ИСПОЛЬЗУЕТ"}]->(typology)`
    cypher += `MATCH (desk)-[:subsection {type:"СОДЕРЖИТ"}]->(node)`
    cypher += `RETURN node`

    req.neo4j.read(cypher)
        .then(response => {
            let nodes = []
            response.records.map(record => {
                let node = jsonify(record.get('node'))
                if (node) nodes.push(node)
            })
            res.json(nodes)
        })
        .catch(error => {
            console.log(error)
        })
}

exports.getEdges = (req, res) => {
    let cypher  = `MATCH (desk {id:${req.params.id}})-[:subsection {type:"ИСПОЛЬЗУЕТ"}]->(typology)`
    cypher += `MATCH (desk)-[:subsection {type:"СОДЕРЖИТ"}]->()-[edge]->()`
    cypher += `RETURN edge`

    req.neo4j.read(cypher)
        .then(response => {
            let edges = []
            response.records.map(record => {
                let edge = jsonify(record.get('edge'), false)
                if (edge) edges.push(edge)
            })
            res.json(edges)
        })
        .catch(error => {
            console.log(error)
        })
}

exports.getTypology = (req, res) => {
    let cypher = `MATCH (desk {id:${req.params.id}})`
    cypher += `MATCH (desk)-[:subsection*1.. {type:"ИСПОЛЬЗУЕТ"}]->(typology) `
    cypher += `WHERE typology.type="Типология" `
    cypher += `MATCH (typology)-[:subsection {type:"СОДЕРЖИТ"}]->(type) `
    cypher += `RETURN 
                type,
                typology.id AS typologyID, 
                typology.title AS typologyTitle`

    req.neo4j.read(cypher)
        .then(response => {
            if (!response.records.length) {
                return {error: 'Нет доски с id: ' + req.params.id}
            }

            let types = []
            response.records.map(record => {
                let type = jsonify(record.get('type'))
                if (type) types.push(type)
            })

            const id = response.records[0].get('typologyID').low ? response.records[0].get('typologyID').low : response.records[0].get('typologyID')
            const typology = {
                id,
                title: response.records[0].get('typologyTitle')
            }

            res.json({types, typology})
            
        })
        .catch(error => {
            //console.log(error)
            return {error: error}
        })
}