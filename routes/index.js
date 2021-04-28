const router = require('express').Router();


// API with nodes, edges, users and etc.
router.use('/api', require('./api'))

router.use('/filters', require('./filters'))


router.get('/test', (req, res) => {
    //console.log(req.headers)
    res.header('test-header', 'test').send('ok')
})


// Sending HTML-pages to user (in future will be in React on client-side)
router.get('/', (req, res) => {
    res.redirect('/api')
})

router.get('/makeDesksAsLabels', async (req, res) => {
    req.neo4j.read(`MATCH (n:Доска) RETURN n.title AS title`)
        .then(response => {
            response.records.forEach(record => {
                let desk = record.get('title')

                let cypher = `MATCH (n:\`Доска\`)-[:subsection {type:"СОДЕРЖИТ"}]->(node)
                                WHERE n.title="${desk}"
                                SET node:\`${desk}\``

                req.neo4j.write(cypher)
            });
        })

    
})


module.exports = router