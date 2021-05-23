function jsonify(record, node = true) {
    let properties = record.properties

    try {
        for (key in properties) {
            if (properties[key].low != undefined) {
                properties[key] = properties[key].low
            }
        }
    } catch (e) {
        let object = node ? 'вершины' : 'ребра'
        console.log(`Ошибка в параметрах ${object} id: ${record.identity.low}`)

        //Вывести параметры вершины:
        //console.log(node)
        //Вывести ошибку:
        //console.log(e)

        return null 
    }

    if (!node) {
        return {
            identity: record.identity.low,
            start: record.start.low,
            end: record.end.low,
            type: record.type,
            properties: properties
        }
    }

    return {
        identity: record.identity.low,
        label: record.labels[0],
        properties: properties
    }
}


module.exports = jsonify