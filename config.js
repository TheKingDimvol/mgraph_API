module.exports = {
    neo4j: {
        url: 'bolt://localhost:7687',
        username: 'neo4j',
        password: '123',
        database: 'Graph Database'
    },
    server: {
        PORT: process.env.PORT || 5000
    }
}