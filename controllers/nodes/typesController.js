const jsonify = require("../../jsonifier")


exports.getTypesOfTypology = (req, res) => {
    let cypher = `MATCH (d:Доска) WHERE d.id=${req.query.typology} AND d.type="Типология" ` + 
                 `MATCH (n) WHERE (n)<-[:subsection {type:"СОДЕРЖИТ"}]-(d) RETURN n`

    req.neo4j.read(cypher)
        .then(result => {
            if (!result.records.length) {
                res.status(400).json({error: `Типологии с id='${req.query.typology}' не существует`})
                return
            }

            let nodes = []
            result.records.map(record => {
                let node = jsonify(record.get('n'))
                if (node) nodes.push(node)
            }) 

            res.json(nodes)
        }) 
        .catch(e => {  
            //console.log(e)
            res.status(400).json({error: 'Что-то не так с запросом'})
        })
}