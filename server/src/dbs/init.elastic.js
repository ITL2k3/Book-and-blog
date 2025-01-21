import {Client} from '@elastic/elasticsearch'



const client = new Client({
    node: 'https://localhost:9200',
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
    },
    tls:{
        ca: process.env.ELASTIC_CERT,
        rejectUnauthorized: true
    }
})

try{
    const health = await client.cluster.health();
    if(health) console.log('Elasticserch connect success');
}catch(err){
    console.log('Error connecting to Elasticsearch');
}

export default client