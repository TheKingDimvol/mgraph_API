const jsonify = require("../../jsonifier")


exports.getNodesByDesk = (req, res) => {
    let cypher = `MATCH (d:Доска) WHERE d.id=${req.query.desk} ` + 
                 `MATCH (n) WHERE (n)<-[:subsection {type:"СОДЕРЖИТ"}]-(d) RETURN n`

    req.neo4j.read(cypher)
        .then(result => {
            let nodes = []
            result.records.map(record => {
                let node = jsonify(record.get('n'))
                if (node) nodes.push(node)
            })

            if (nodes.length === 0) {
                return res.status(204).json({ message: 'Доска пустая или доски с данным id не существует' })
            }

            res.status(200).json(nodes)
        })
        .catch(error => {
            //console.log(error.message)
            res.status(500).json({ error: error.message})
        })
}