const router = require('express').Router();

// API with nodes, edges, users and etc.
router.use('/api', require('./api'))

router.use('/filters', require('./filters'))


// Sending HTML-pages to user (in future will be in React on client-side)
router.get('/', (req, res) => {
    res.redirect('/api')
})


module.exports = router