const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ffqwvi7.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(client)
async function run() {

  try {
    await client.connect();
    const servicesCollection = client.db('gameData').collection('services');

    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services)
    })

    app.post('/service', async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service)
      res.send(result)
    })

    app.delete('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
       const result = await servicesCollection.deleteOne(query)
      res.send(result)

    })

    app.put('/service/:id', async (req, res) => {
      const { Food } = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await servicesCollection.updateOne(query, { $set: { Food } }, { upsert: false });
      res.send(result);
    });
    
    

  }

  finally {

  }

}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})