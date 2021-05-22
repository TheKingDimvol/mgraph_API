const bcrypt = require('bcrypt')


exports.checkUserInfo = async (req, res, next) => {
    if (req.body.username == '' || req.body.email == '' || req.body.password) return res.status(400).json({ error: "Неправильные данные" })
    const userInfoUnavailable = await req.neo4j.read(
        `MATCH (user:User) WHERE user.username="${req.body.username}" OR user.email="${req.body.email}" 
         RETURN user.username AS username, user.email AS email`
        )
        .then(response => {
            if (response.records.length === 0) return

            if (response.records[0].get('username') === req.body.username) {
                return { error: 'Пользователь с данным именем уже существует' }
            }
            if (response.records[0].get('email') === req.body.email) {
                return { error: 'Пользователь с данной почтой уже существует' }
            }
        })
        .catch(error => {
            return { error }
        })

    if (userInfoUnavailable) {
        return res.status(400).json(userInfoUnavailable)
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    req.user = {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email
    }

    next()
}

exports.signup = (req, res) => {
    req.neo4j.write(`CREATE (user:User {uuid:randomUUID()}) SET user+=$properties RETURN user.uuid`, { 'properties': req.user })
        .then(response => {
            if (response.records.length != 1) return res.status(500).json({ error: 'Что-то пошло не так' })
            req.user.uuid = response.records[0].get('user.uuid')
            res.status(201).json('Успешно')
        })
        .catch(error => {
            res.status(400).json({ error })
        })
}