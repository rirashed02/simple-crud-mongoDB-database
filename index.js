const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://rirashed02:J6379pNgcK7gRkTO@cluster0.z8w3emk.mongodb.net/?retryWrites=true&w=majority";
const port = process.env.PORT || 5000;
const cors = require('cors')

// middleware
app.use(cors())
app.use(express.json())

// rirashed02
// J6379pNgcK7gRkTO



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // const database = client.db("usersDB");
        // const userCollection = database.collection("users");

        const userCollection = client.db('usersDB').collection('users');

        // second operation
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })

        // 3rd operation
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await userCollection.findOne(query)
            res.send(user)
        })

        // first operation
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('New user', user)
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        // 5th operation
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(id, user);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateUser = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }

            const result = await userCollection.updateOne(filter, updateUser, options)
            res.send(result)

        })

        // 4th operation
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Please delete from database', id)
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Simple CRUD is running on server')
})

app.listen(port, (req, res) => {
    console.log(`simple crud is running on PORT: ${port}`)
})