exports.accessControll = async (req, res, next) => {
    if (req.method === 'GET') {
        return next()
    }

    console.log(req.user)

    if (req.user.roles.includes('Super Admin')) {
        return next()
    }

    if (req.user.roles.includes('Admin') || req.user.roles.length === 1) {
        return res.status(400).json({ error: 'В доступе отказано' })
    }
    
    switch (req._parsedUrl.pathname) {
        case('/nodes'): {
            console.log('nodes')
            break
        }
        case('/edges'): {
            console.log('edges')
            break
        }
        case('/types'): {
            console.log('types')
            break
        }
        case('/desks'): {
            console.log('desks')
            break
        }
        case('/typologies'): {
            console.log('typologies')
            break
        }
    }
    next()
}