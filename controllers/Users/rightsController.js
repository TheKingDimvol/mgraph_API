function rightsControl(neo4j, username, role, ifAdd) {
    const action = ifAdd ? 'SET' : 'REMOVE'
    return neo4j.write(`MATCH (user) WHERE user.username="${username}" ${action} user:\`${role}\``)
        .then(response => {
            return 'Успешно'
        })
        .catch(error => {
            return error
        })
}


exports.addAdminRole = (req, res) => {
    rightsControl(req.neo4j, req.body.username, 'Admin', true)
        .then(response => {
            if (response === 'Успешно') {
                res.send(response)
                return
            }
            res.status(400).json({ error: response })
        })
}

exports.addDeskCreatorRole = (req, res) => {
    rightsControl(req.neo4j, req.body.username, 'Desk Creator', true)
        .then(response => {
            if (response === 'Успешно') {
                res.send(response)
                return
            }
            res.status(400).json({ error: response })
        })
}

exports.removeAdminRole = (req, res) => {
    rightsControl(req.neo4j, req.body.username, 'Admin', false)
        .then(response => {
            if (response === 'Успешно') {
                res.send(response)
                return
            }
            res.status(400).json({ error: response })
        })
}

exports.removeDeskCreatorRole = (req, res) => {
    rightsControl(req.neo4j, req.body.username, 'Desk Creator', false)
        .then(response => {
            if (response === 'Успешно') {
                res.send(response)
                return
            }
            res.status(400).json({ error: response })
        })
}

exports.addEditorRole = (req, res) => {
    let cypher = `MATCH (user) WHERE user.username="${req.body.username}" `
    cypher += `MATCH (desk) WHERE desk.id=${req.body.desk} `
    cypher += `CREATE (desk)<-[:subsection {type:"РЕДАКТОР"}]-(user)`

    req.neo4j.write(cypher)
        .then(response => {
            res.send('Успешно')
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error })
        })
}

exports.removeEditorRole = (req, res) => {
    let cypher = `MATCH (user) WHERE user.username="${req.body.username}" `
    cypher += `MATCH (desk) WHERE desk.id=${req.body.desk} `
    cypher += `MATCH (desk)<-[edge {type:"РЕДАКТОР"}]-(user) `
    cypher += `DELETE edge`

    req.neo4j.write(cypher)
        .then(response => {
            res.send('Успешно')
        })
        .catch(error => {
            res.status(400).json({ error })
        })
}