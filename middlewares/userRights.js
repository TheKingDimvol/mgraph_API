exports.getUserRights = async (req, res, next) => {
    if (req.method === 'GET') {
        return next()
    }

    let cypher = `MATCH (n:User) WHERE n.name="${req.user.username}" RETURN labels(n) AS roles, n.desks AS desks`

    const userAccess = await req.neo4j.read(cypher)
        .then(response => {
            const roles = response.records[0].get('roles')
            const desks = response.records[0].get('desks')

            return  { roles, desks }
        })
        .catch(error => {
            console.log(error)
        })

    req.user.roles = userAccess.roles
    req.user.desks = userAccess.desks

    next()
}