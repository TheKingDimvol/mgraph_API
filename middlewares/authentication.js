const jwt = require("jsonwebtoken")

exports.authenticateToken = (req, res, next) => {  
    const authHeader = req.headers['auth-token']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        req.user = {}
        req.user.authenticated = false
        return next()
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ error: 'Нет доступа' })
        req.user = user
        req.user.authenticated = true
        next()
    })
}
