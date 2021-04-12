const jsonify = require('../../jsonifier')


// Функция для чтения ребра. Нужна?
/*
exports.get = (req, res) => {
    req.neo4j.read(`MATCH ()-[r]->()  WHERE id(r) = ${req.params.id} RETURN r`)
        .then(record => {
            let edge = jsonify(record.records[0].get('r'), false)

            res.json(edge)
        })
        .catch(e => {
            console.log(e)
            res.status(400).json({error: 'Нет ребра с id: ' + req.params.id})
        })
}
*/

exports.post = (req, res) => {
    req.neo4j.write(`CREATE (n {id:${req.body.startID}})-[r:subsection $properties]->(m {id:${req.body.endID}})`,
                    {'properties': req.body.properties})
        .then(nothing => {
            res.status(200).end()
        })
        .catch(error => {
            //console.log(error)
            res.status(400).json({error: 'Ошибка в добавлении ребра \n' + error})
        })
}

// Функция для изменения ребра. Нужна?
/*
exports.put = (req, res) => {
    req.neo4j.write(`MATCH (n {id:${req.body.startID}})-[r]->(m {id:${req.body.endID}}) SET r+=$properties`,
                    {'properties': req.body.properties})
        .then(nothing => {
            res.status(200).end()
        })
        .catch(error => {
            //console.log(error)
            res.status(400).json({error: 'Ошибка в изменении ребра \n' + error})
        })
}
*/

exports.delete = (req, res) => {
    // (n)-[r {type:"<Тип>"}]->(m)  -  удалить ребра идущие из вершины n в вершину m с определенным типом <Тип>
    // (n)-[r]->(m)  -  удалить ребра идущие из вершины n в вершину m
    // (n)-[r]-(m)  -  удалить все ребра между вершинами
    req.neo4j.write(`MATCH (n {id:${req.body.startID}})-[r {type:"${req.body.type}"}]->(m {id:${req.body.endID}}) DELETE r`)
        .then(nothing => {
            res.status(200).end()
        })
        .catch(error => {
            //console.log(error)
            res.status(400).json({error: 'Ошибка в удалении ребра \n' + error})
        })
}
