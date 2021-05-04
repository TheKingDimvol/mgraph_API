exports.editorExists = (req, res, next) => {
    let cypher = `MATCH (user:User {username:"${req.body.username}"}) `
    cypher += `MATCH (desk:Доска {id:${req.body.desk}}) `
    cypher += `RETURN exists((user)-[{type:"РЕДАКТОР"}]->(desk)) AS exists`
    req.neo4j.read(cypher)
        .then(response => {
            if (response.records.length == 0) {
                res.status(400).json({ error: 'Нет пользователя а таким именем или доски с таким id' })
            }

            if (response.records[0].get('exists')) {
                return res.status(400).json({ error: 'Этот пользователь уже редактор данной доски' })
            }

            next()
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({ error })
        })
}