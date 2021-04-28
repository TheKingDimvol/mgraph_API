const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.confirmUserInput = (req, res, next) => {
    if (!req.body.username) {
        return res.status(400).json({ error: 'Нет имени пользователя' })
    }

    const user = {
        username: req.body.username
    }
    req.user = user
    
    next()
}

exports.authenticate = async (req, res) => {
    let cypher = `MATCH (n:User) WHERE n.name="${req.user.username}" RETURN n.name AS name`
    const findUser = await req.neo4j.read(cypher)
        .then(response => {
            return response.records.length === 1
        })
        .catch(error => {
            console.log(error)
            return error
        })

    if (findUser) {
        const accessToken = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET)
        return res.json({ accessToken })
    }

    res.send('Нет пользователя с данным именем')
}