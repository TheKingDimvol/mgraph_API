const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.authenticate = async (req, res) => {
    let cypher = `MATCH (n:User) WHERE n.username="${req.user.username}" RETURN n.uuid AS uuid, n.password AS password`
    const userError = await req.neo4j.read(cypher)
        .then(response => {
            if (response.records.length != 1) {
                return 'Нет пользователя с данным именем'
            }
            if (response.records[0].get('password') !== req.body.password) {
                return 'Неверный пароль'
            }

            req.user.uuid = response.records[0].get('uuid')
        })
        .catch(error => {
            //console.log(error)
            return error
        })

    if (userError) {
        return res.status(400).json({ error: userError })
    }

    const accessToken = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken })
}