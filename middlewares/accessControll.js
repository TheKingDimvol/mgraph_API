exports.workWithGraph = (req, res, next) => {
    if (req.method === 'GET' || req.user.roles.includes('Super')) {
        return next()
    }

    if (req.user.desksEdit.includes(req.body.desk)) {
        return next()
    }

    res.status(400).json({ error: 'В доступе отказано' })
}

exports.workWithDesks = (req, res, next) => {
    if (req.method === 'GET' || req.user.roles.includes('Super')) {
        return next()
    }

    if (req.method === 'POST') {
        if (req.user.roles.includes('Desk Creator')) return next()
        return res.status(400).json({ error: 'В доступе отказано' })
    }

    if (req.user.desksCreated.includes(req.body.desk)) {
        return next()
    }

    res.status(400).json({ error: 'В доступе отказано' })
}

exports.accessToDeleteUser = (req, res, next) => {
    if (req.user.roles.includes('Super') || req.user.roles.includes('Admin') || req.params.uuid == req.user.uuid) {
        return next()
    }
    res.status(400).json({ error: 'Нет прав' })
}

exports.accessGetUsers = (req, res, next) => {
    if (req.user.roles.some(role => ['Super', 'Admin', 'Desk Creator'].includes(role))) {
        return next()
    }
    res.status(400).json({ error: 'Нет прав' })
}

exports.accessMakeEditor = (req, res, next) => {
    if (req.user.roles.includes('Super')) {
        return next()
    }

    if (req.user.desksCreated.includes(req.body.desk)) {
        return next()
    }

    res.status(400).json({ error: 'Нет прав' })
}

exports.accessMakeAdmin = (req, res, next) => {
    if (req.user.roles.includes('Super')) {
        return next()
    }

    res.status(400).json({ error: 'Нет прав' })
}

exports.accessMakeDeskCreator = (req, res, next) => {
    if (req.user.roles.includes('Super') || req.user.roles.includes('Admin')) {
        return next()
    }

    res.status(400).json({ error: 'Нет прав' })
}