const jsonify = require("../../jsonifier")


exports.getListOfTypologies = (req, res) => {
    res.redirect('/api/desks?type=Типология')
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

exports.getTypology = (req, res) => {
    let cypher = `MATCH (typology:Доска)-[:subsection {type:"СОДЕРЖИТ"}]->(type) ` 
    cypher += `WHERE typology.id=${req.params.id} AND typology.type='Типология' `
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

exports.createTypology = (req, res) => {
    let cypher = `MATCH (all) WITH max(all.id) AS maxID `
    cypher += `MATCH (user) WHERE user.uuid="${req.user.uuid}" `
    cypher += `CREATE (typology:Доска {title:"${req.body.title}", type:"Типология", id:maxID + 1})`
    cypher += `CREATE (typology)<-[:subsection {type:"СОЗДАЛ"}]-(user) `

    req.neo4j.write(cypher)
        .then(response => {
            res.status(200).end()
        })
        .catch(error => {
            res.status(400).json({error: error})
        })
}

exports.changeTypology = (req, res) => {
    // Нужна ли проверка на существование вершины???
    req.neo4j.write(`MATCH (n) WHERE n.id=${req.params.id} SET n+=$properties`, {'properties': req.body})
        .then(response => {
            res.status(200).end()
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: 'Плохой запрос'})
        })
}

exports.deleteTypology = (req, res) => {
    // Нужна ли проверка на существование вершины???
    let cypher = `MATCH (n:Доска {type:"Типология"})-[*0..]->(m) WHERE n.id=${req.params.id} `
    cypher += `DETACH DELETE n, m`

    req.neo4j.write(cypher)
        .then(response => {
            res.status(200).send('Успешно')
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: 'Плохой запрос'})
        })
}