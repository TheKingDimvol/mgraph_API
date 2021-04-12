const router = require('express').Router();
const db = require('../../neo4j')


router.get('/', (req, res) => {
    db.read("MATCH (n:Доска) RETURN n.title AS title, id(n) AS id")
        .then(desks => {
            let table = []
            desks.records.map(desk => {
                let obj = {
                    'Название' : desk.get('title'),
                    'id' : desk.get('id').low
                    }
                table.push(obj)
            })
            res.json(table)
        })
})

router.get('/:desk', (req, res) => {
    res.redirect('/api/nodes?desk=' + req.params.desk)
})


module.exports = router