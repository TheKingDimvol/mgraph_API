const router = require('express').Router();
const shortestPath = require('./shortestPath')
const depthFilter = require('./depthFilter')


// Shows default API routes
router.get('/', (req, res) => {
    res.json("In progress...")
})

router.get('/shortestPath', shortestPath.get)

router.get('/depthFilter/:node', depthFilter.get)


module.exports = router