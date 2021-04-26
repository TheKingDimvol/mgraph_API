const jsonify = require("../../jsonifier")


exports.getListOfTypologies = (req, res) => {
    req.neo4j.read("MATCH (n:Доска) WHERE n.type='Типология' RETURN n.title AS title, n.id AS id")
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

exports.getDesksTypology = (req, res) => {
    let cypher = `MATCH (desk:Доска) `
    cypher += `WHERE desk.id=${req.query.desk} `
    cypher += `MATCH (desk)-[:subsection*1.. {type:"ИСПОЛЬЗУЕТ"}]->(typology) `
    cypher += `WHERE typology.type="Типология" `
    cypher += `RETURN typology.id AS id, typology.title AS title`

    req.neo4j.read(cypher)
        .then(response => {
            let id = response.records[0].get('id')
            if (id.low !== undefined) {
                id = id.low
            }

            let answer = {
                "title": response.records[0].get('title'),
                "id": id
            }

            res.json(answer)
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({error: error})
        })
} 

exports.get = (req, res) => {
    let cypher = `MATCH (typology:Доска)-[:subsection {type:"СОДЕРЖИТ"}]->(type) ` 
    cypher += `WHERE typology.id=${req.params.typology} AND typology.type='Типология' `
    cypher += `RETURN type`

    req.neo4j.read(cypher)
        .then(response => {
            let types = []
            response.records.map(record => {
                let type = jsonify(record.get('type'))
                if (type) types.push(type)
            })
            res.json(types)
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({error: error})
        })
}

exports.post = (req, res) => {
    let cypher = `MATCH (all) WITH max(all.id) AS maxID `
    cypher += `CREATE (typology:Доска {title:"${req.body.title}", type:"Типология", id:maxID + 1})`

    req.neo4j.write(cypher)
        .then(response => {
            res.status(200).end()
        })
        .catch(error => {
            res.status(400).json({error: error})
        })
}