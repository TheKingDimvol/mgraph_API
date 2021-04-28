const jsonify = require("../../jsonifier")


exports.getListOfDesks = (req, res) => {
    if (req.query.desk) {
        res.redirect('/typologyOfDesk?desk=' + req.query.desk)
    }
    req.neo4j.read("MATCH (n:Доска) WHERE n.type<>'Типология' RETURN n.title AS title, n.id AS id")
        .then(desks => {
            let table = []
            desks.records.map(desk => {
                let id = desk.get('id')
                if (id.low !== undefined) {
                    id = id.low
                }
                let obj = {
                    'Название' : desk.get('title'),
                    'id' : id
                    }
                table.push(obj)
            })
            res.json(table)
        })
}

exports.getAllDeskData = async (req, res) => {
    let answer = {}

    let cypher = `MATCH (desk {id:${req.params.id}})`
    cypher += `MATCH (desk)-[:subsection*1.. {type:"ИСПОЛЬЗУЕТ"}]->(typology) `
    cypher += `WHERE typology.type="Типология" `
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
                    return {error: 'Нет доски с id: ' + req.params.id}
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

                desk.id = record.get('deskID').low !== undefined ? record.get('deskID').low : record.get('deskID')
                desk.title = record.get('deskTitle')
                typology.id = record.get('typologyID').low ? record.get('typologyID').low : record.get('typologyID')
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

    cypher  = `MATCH (desk {id:${req.params.id}})-[:subsection {type:"ИСПОЛЬЗУЕТ"}]->(typology)`
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


    cypher  = `MATCH (desk {id:${req.params.id}})-[:subsection {type:"ИСПОЛЬЗУЕТ"}]->(typology)`
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

exports.createDesk = (req, res) => {
    let cypher = `MATCH (typology:Доска) WHERE typology.id=${req.body.typology} `
    cypher += `MATCH (all) WITH max(all.id) AS maxID, typology `
    cypher += `CREATE (desk:Доска {title:"${req.body.title}", type:"${req.body.type}", id:maxID + 1}) `
    cypher += `CREATE (desk)-[:subsection {type:"ИСПОЛЬЗУЕТ"}]->(typology)`

    req.neo4j.write(cypher)
        .then(response => {
            res.status(200).end()
        })
        .catch(error => {
            res.status(400).json({error: error})
        })
}

exports.changeDesk = (req, res) => {
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

exports.deleteDesk = (req, res) => {
    // Нужна ли проверка на существование вершины???
    req.neo4j.write(`MATCH (n:Доска) WHERE n.id=${req.params.id} DETACH DELETE n`)
        .then(response => {
            res.status(200).end()
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: 'Плохой запрос'})
        })
}