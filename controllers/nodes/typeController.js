const jsonify = require('../../jsonifier')


exports.get = (req, res) => {

    req.neo4j.read(`MATCH (n:Тип) WHERE n.id=${req.params.id} RETURN n`)
        .then(node => {
            if (!node) {
                throw new Error('Нет вершины с id: ' + req.params.id)
            }
            let nodeJSON = jsonify(node.records[0].get('n'))
            res.json(nodeJSON)
        })
        .catch(e => {
            //console.log(e)
            res.status(400).json({error: 'Нет вершины с id: ' + req.params.id})
        })
}

exports.post = (req, res) => {

}

exports.put = (req, res) => {

}

exports.delete = (req, res) => {

}
