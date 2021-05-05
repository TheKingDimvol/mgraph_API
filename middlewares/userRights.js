exports.getUserRights = async (req, res, next) => {
    if (!req.user.authenticated) {
        return next()
    }

    let cypher = `MATCH (n:User) WHERE n.username="${req.user.username}" `
    cypher += `RETURN labels(n) AS roles`

    let userError = await req.neo4j.read(cypher)
        .then(response => {
            if (response.records.length == 0) {
                return 'Нет данного пользователя'
            }

            req.user.roles = response.records[0].get('roles').filter(role => role !== 'User')
        })
        .catch(error => {
            console.log(error)
            return error
        })

    if (userError) {
        return res.status(400).json({ error: userError })
    }

    if (req.user.roles.includes('Super') || req.user.roles.includes('Admin')) {
        return next()
    }

    cypher = `MATCH (n) WHERE n.username="${req.user.username}" `
    cypher += `MATCH (n)-[edge]->(desk) `
    cypher += `RETURN edge.type AS type, desk.id AS id`

    userError = await req.neo4j.read(cypher)
        .then(response => {
            req.user.desksCreated = []
            req.user.desksEdit = []

            if (response.records.length == 0) {
                return
            }

            response.records.forEach(record => {
                let id = record.get('id')
                id = id.low != undefined ? id.low : id

                switch (record.get('type')) {
                    case 'СОЗДАЛ':
                        req.user.desksCreated.push(id)
                        req.user.desksEdit.push(id)
                        break
                    case 'РЕДАКТОР':
                        req.user.desksEdit.push(id)
                        break
                }
            })
        })
        .catch(error => {
            console.log(error)
            return error
        })

    if (userError) {
        return res.status(400).json({ error: userError })
    }

    next()
}