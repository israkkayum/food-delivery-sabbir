const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4c1ex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('foodDelivery');
        const categoriesCollection = database.collection('categories');
        const restaurantCollection = database.collection('restaurant');
        const teamsCollection = database.collection('teams')
        const usersCollection = database.collection('users')

        app.get('/categories', async(req, res) => {
            const cursor = categoriesCollection.find({});
            const categories = await cursor.toArray();
            res.send(categories);
        });

        app.get('/restaurant', async(req, res) => {
            const cursor = restaurantCollection.find({});
            const restaurant = await cursor.toArray();
            res.send(restaurant);
        });

        app.post('/restaurant', async(req, res) => {
            const newUser = req.body;
            const result = await restaurantCollection.insertOne(newUser);
            res.json(result);
       });

        app.get('/restaurant/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await restaurantCollection.findOne(query);
            res.json(product);

        });

        app.post('/users', async(req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.json(result);
       });

       app.get('/users', async(req, res) => {
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
    });
  
        app.get('/teams', async(req, res) => {
            const cursor = teamsCollection.find({});
            const teams = await cursor.toArray();
            res.send(teams);
        });
        

    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Ema jon server is running and running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})