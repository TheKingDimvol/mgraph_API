const jwt = require("jsonwebtoken")

exports.authenticateToken = (req, res, next) => {
    if (req.method === 'GET') {
        return next()
    }

    const authHeader = req.headers['auth-token']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(400).json({error: 'Токен аутентификации отсутвует или в неправильном формате'})
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ error: 'Нет доступа' })
        req.user = user
        next()
    })
}
