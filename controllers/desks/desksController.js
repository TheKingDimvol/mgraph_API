const jsonify = require("../../jsonifier")


exports.getListOfDesks = (req, res) => {
    req.neo4j.read("MATCH (n:Доска) WHERE n.type<>'Типология' RETURN n.title AS title, n.id AS id")
        .then(desks => {
            let table = []
            desks.records.map(desk => {
                let obj = {
                    'Название' : desk.get('title'),
                    'id' : desk.get('id').low
                    }
                table.push(obj)
            })
            res.json(table)
        })
}

exports.get = async (req, res) => {
    let answer = {}

    let cypher = `MATCH (desk {id:${req.params.desk}})-[:subsection {type:"ИСПОЛЬЗУЕТ"}]->(typology) `
    cypher += `MATCH (typology)-[:subsection {type:"СОДЕРЖИТ"}]->(type) `
    cypher += `RETURN 
                type,
                desk.id AS deskID, 
                desk.title AS deskTitle, 
                typology.id AS typologyID, 
                typology.title AS typologyTitle`

    let checkForError = await req.neo4j.read(cypher)
            .then(response => {
                if (!response.records.length) {
                    return {error: 'Нет доски с id: ' + req.params.desk}
                }

                let types = []
                response.records.map(record => {
                    let type = jsonify(record.get('type'))
                    if (type) types.push(type)
                })

                answer.types = types

                return response.records[0]
            })
            .catch(error => {
                console.log(error)
                return {error: error}
            })
            .then(record => {
                if (record.error) {
                    return record.error
                }

                let desk = {}
                let typology = {}

                desk.id = record.get('deskID').low
                desk.title = record.get('deskTitle')
                typology.id = record.get('typologyID').low
                typology.title = record.get('typologyTitle')

                answer.desk = desk
                answer.typology = typology

                return 
            })
            .catch(error => {
                console.log(error)
                return error
            })

    if (checkForError) {
        res.status(400).json({error: checkForError})
        return
    }

    cypher  = `MATCH (desk {id:${req.params.desk}})-[:subsection {type:"ИСПОЛЬЗУЕТ"}]->(typology)`
    cypher += `MATCH (desk)-[:subsection {type:"СОДЕРЖИТ"}]->(node)`
    cypher += `RETURN node`

    let nodes = await req.neo4j.read(cypher)
        .then(response => {
            let array = []
            response.records.map(record => {
                let node = jsonify(record.get('node'))
                if (node) array.push(node)
            })
            return array
        })
        .catch(error => {
            console.log(error)
        })

    answer.nodes = nodes


    cypher  = `MATCH (desk {id:${req.params.desk}})-[:subsection {type:"ИСПОЛЬЗУЕТ"}]->(typology)`
    cypher += `MATCH (desk)-[:subsection {type:"СОДЕРЖИТ"}]->()-[edge]->()`
    cypher += `RETURN edge`

    let edges = await req.neo4j.read(cypher)
        .then(response => {
            let array = []
            response.records.map(record => {
                let edge = jsonify(record.get('edge'), false)
                if (edge) array.push(edge)
            })
            return array
        })
        .catch(error => {
            console.log(error)
        })

    answer.edges = edges
    

    res.json(answer)
}

