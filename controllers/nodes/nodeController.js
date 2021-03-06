const jsonify = require('../../jsonifier')


exports.get = (req, res) => {
    const notNodes = ['Доска', 'Тип']

    req.neo4j.read(`MATCH (n) WHERE n.id=${req.params.id} RETURN n`)
        .then(response => {
            /*if (!response.records.length) {
                res.status(400).json({error: 'Нет вершины с id: ' + req.params.id})
                return 
            }*/
            switch (response.records.length) {
                case 0: 
                    res.status(400).json({error: 'Нет вершины с id: ' + req.params.id})
                    return
                case 1:
                    break
                default:
                    res.status(500).json({error: 'В базе данных несколько вершин с id: ' + req.params.id})
                    return
            }

            let node = jsonify(response.records[0].get('n'))

            if (notNodes.includes(node.label)) {
                res.status(400).json({error: 'Нет вершины с id: ' + req.params.id})
            } else {
                res.json(node)
            }
        })
        .catch(e => {
            //console.log(e)
            res.status(500).json({error: e})
        })
}

exports.post = async (req, res) => {
    let label = ''

    let checkForError = await req.neo4j
        .read(`MATCH (type:Тип {id:${req.body.type}}) RETURN type.title AS title, type.community AS community`)
        .then(response => {
            switch (response.records.length) {
                case 0: 
                    return 'Нет типа с id: ' + req.body.type
                case 1:
                    break
                default:
                    return 'В базе данных несколько типов с id: ' + req.body.type
            }

            label = response.records[0].get('title')
            req.body.properties['community'] = response.records[0].get('community')
        })
        .catch(error => {
            return error
        })

    if (checkForError) {
        //console.log(checkForError)
        res.status(400).json({error: checkForError})
        return
    }


    // Берём все вершины и находим тип по id
    let cypher = `MATCH (all) MATCH (type:Тип) WHERE type.id=${req.body.type} `

    // Передаём максимальный id(max), название типа(label) и номер его сообщества(community) дальше
    cypher += `WITH max(all.id) AS maxID, type.community AS community, type.title AS label `

    // Выбираем доску по id
    cypher += `MATCH (desk:Доска {id:${req.body.desk}}) `

    // Создаём вершину с параметрами id и community, с типом label 
    cypher += `CREATE (node:\`${label}\` {id:maxID + 1}) `

    // Добавляем параметры вершины из запроса
    cypher += `SET node+=$properties `

    // Создаём связь вершины и доски
    cypher += `CREATE (desk)-[:subsection {type:"СОДЕРЖИТ"}]->(node)`

    req.neo4j.write(cypher, {'properties': req.body.properties})
        .then(response => {
            res.status(200).end()
        })
        .catch(error => {
            //console.log(error)
            res.status(400).json({error: 'Ошибка в добавлении вершины ' + error})
        })
}

// Функция может только переписать существующие или добавить новые свойства
// Она не может удалять существующие
exports.put = (req, res) => {
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

exports.delete = (req, res) => {
    // Нужна ли проверка на существование вершины???
    // Нужна проверка на то, что это вершина, а не Тип или Доска???
    req.neo4j.write(`MATCH (n) WHERE n.id=${req.params.id} DETACH DELETE n`)
        .then(response => {
            res.status(200).end()
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: 'Плохой запрос'})
        })
}
