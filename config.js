module.exports = {
    neo4j: {
        url: 'bolt://176.57.217.75:7687',
        username: 'neo4j',
        password: 'miner2',
        database: 'Graph Database'
    },
    server: {
        PORT: process.env.PORT || 5000
    }
}