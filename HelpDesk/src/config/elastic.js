const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client({
  node: process.env.ELASTIC_NODE || 'http://localhost:9200',
});

module.exports = elasticClient;