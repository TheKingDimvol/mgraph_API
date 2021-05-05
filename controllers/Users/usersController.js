exports.getUsers = (req, res) => {
    let cypher = `MATCH (user:User) `
    switch (req.user.roles[0]) {
        case 'Super':
            break
        case 'Admin':
            cypher += `WHERE 'Super' NOT IN labels(user) `
            break
        case 'Desk Creator':
            cypher += `WHERE NOT 'Super' IN labels(user) AND NOT 'Admin' IN labels(user)`
            break
    }
    cypher += `RETURN user.uuid AS uuid, labels(user) AS roles, user.username AS username, user.email AS email `
    cypher += `ORDER BY labels(user)`

    req.neo4j.read(cypher)
        .then(response => {
            let result = []
            response.records.forEach(record => {
                result.push({
                    uuid: record.get('uuid'),
                    username: record.get('username'),
                    email: record.get('email'),
                    roles: record.get('roles')
                })
            })

            res.json(result)
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({ error })
        })
}


exports.deleteUser = (req, res) => {
    req.neo4j.write(`MATCH (n) WHERE n.uuid="${req.params.uuid}" DETACH DELETE n`)
        .then(response => {
            res.send('Успешно')
        })
        .catch(error => {
            res.status(400).json({ error })
        })
}