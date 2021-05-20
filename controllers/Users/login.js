const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()


exports.authenticate = async (req, res) => {
    let cypher = `MATCH (n:User) WHERE n.username="${req.user.username}" RETURN n.uuid AS uuid, n.password AS password`
    const userError = await req.neo4j.read(cypher)
        .then(async response => {
            if (response.records.length != 1) {
                return 'Нет пользователя с данным именем'
            }
            if (!await bcrypt.compare(req.body.password, response.records[0].get('password'))) {
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

    const user = {
        username: req.user.username,
        uuid: req.user.uuid
    }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken })
}