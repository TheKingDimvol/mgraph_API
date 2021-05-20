exports.confirmUserInput = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ error: 'Нет имени пользователя или пароля' })
    }

    const user = {
        username: req.body.username,
        password: req.body.password
    }
    req.user = user
    
    next()
}