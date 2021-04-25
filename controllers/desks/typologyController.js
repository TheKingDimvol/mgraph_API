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