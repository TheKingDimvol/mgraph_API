const { roles } = require('../../config')
const jsonify = require('../../jsonifier')


exports.getType = (req, res) => {
    req.neo4j.read(`MATCH (n:Тип) WHERE n.id=${req.params.id} RETURN n`)
        .then(response => {
            if (!response.records.length) {
                res.status(400).json({error: 'Нет типа с id: ' + req.params.id})
                return 
            }

            let node = jsonify(response.records[0].get('n'))
            res.json(node)
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: e})
        })
}

exports.createType = (req, res) => {
    // Берём все вершины
    let cypher = `MATCH (all) `

    // Передаём максимальный id(max) дальше
    cypher += `WITH max(all.id) AS max `

    // Выбираем типологию по id
    cypher += `MATCH (typology:Доска {id:${req.body.desk}, type:"Типология"}) `

    // Создаём тип с параметром id
    cypher += `CREATE (type:Тип {id:max + 1}) `

    // Добавляем параметры типа из запроса
    cypher += `SET type+=$properties `

    // Создаём связь типа и типологии
    cypher += `CREATE (typology)-[:subsection {type:"СОДЕРЖИТ"}]->(type) `

    // Вовзращаем id типологии для проверки
    cypher += `RETURN typology.id`

    req.neo4j.write(cypher, {'properties': req.body.properties})
        .then(response => {
            if (response.records.length === 0) {
                res.status(400).json({error: 'Нет типологии с id: ' + req.body.desk})
            }
            res.status(200).end()
        })
        .catch(error => {
            //console.log(error)
            res.status(400).json({error: 'Ошибка в добавлении типа ' + error})
        })
}

exports.changeType = (req, res) => {
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

exports.deleteType = (req, res) => {
    // Нужна ли проверка на существование типа???
    req.neo4j.write(`MATCH (n:Тип) WHERE n.id=${req.params.id} DETACH DELETE n`)
        .then(response => {
            res.status(200).end()
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: 'Плохой запрос'})
        })
}
