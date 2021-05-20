exports.getRoles = async (req, res) => {
    let cypher = `MATCH (n) WHERE n.uuid="${req.params.uuid}" `
    cypher += `RETURN labels(n)`

    try {
        let response = await req.neo4j.read(cypher)
        let records = response.records 

        if (records.length === 0) {
            return res.json({ error: 'Нет пользователя с таким uuid' })
        }

        const user = {}

        user.roles = records[0].get('labels(n)')

        if ('Super' in user.roles || 'Admin' in user.roles) return res.json(user)


        cypher = `MATCH p=(n)-[]->(desk:Доска) `
        cypher += `WHERE n.uuid="${req.params.uuid}" `
        cypher += `RETURN relationships(p), desk.id, desk.title`

        response = await req.neo4j.read(cypher)
        records = response.records 

        if (records) return res.json(user)

        user.desks = []

        records.map(record => {
            const role = {
                role: record.get('relationships(p)')[0].properties.type,
                deskID: record.get('desk.id').low ? record.get('desk.id').low : record.get('desk.id'),
                deskTitle: record.get('desk.title')
            }
            user.desks.push(role)
        })

        res.send(user)  
    } catch (error) {
        console.log(error)
        res.status(400).json({ error })
    }
}