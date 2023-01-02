require ('dotenv').config();
const express = require ('express');
const cors = require ('cors');
const {MongoClient} = require ('mongodb');

const app = express();
const port = process.env.PORT || 8080;
const URI = process.env.URI;

const client = new MongoClient(URI);

app.use(cors());
app.use (express.json());

app.get('/', async (req,res)=>{
    try{
        const con = await client.connect();
        const data = await con.db('People').collection('users').find().toArray();
        await con.close();
        res.send (data);
    }catch (err){
        res.status(500).send({error});
    }
});

app.get('/adress', async (req,res)=>{
    try{
        const con = await client.connect();
        const data = await con.db('People').collection('adress').find().toArray();
        await con.close();
        res.send (data);
    }catch (err){
        res.status(500).send({error});
    }
});

app.post ('/users/users', async (req,res)=>{
    try{
        const con = await client.connect();
        const data = await con.db ('People').collection ('users').insertOne(
            {
                name:"Anastasija",
                username:"Likami",
                email:"a.simdiankina1996@gmail.com",
            }
        )
        .toArray()
        await con.close();
        res.send (data);
    }catch (err){
        res.status(500).send({error});
    }
})

app.post ('/users/adress', async (req,res)=>{
    try{
        const con = await client.connect();
        const data = await con.db ('People').collection('adress').insertOne(
            {
                id:"63b30e74bcebbbc26f8f601a",
                street:"Energetiku",
                suite: "6-51",
                city:"Visaginas",
                zipcode:"92998-3874"
            }
        )
        .toArray()
        await con.close();
        res.send (data);
    }catch (err){
        res.status(500).send({error});
    }
})

app.get ('/users/', async (req,res)=>{
    try{
        const con = await client.connect();
        const data = await con.db ('People').collection ('users')
        .aggregate([
            {$match:{}},
            {
                $lookup:{
                    from:"adress",
                    localField:"_id",
                    foreignField:"_id",
                    as:"adress",
                }, 
            }
            // {$unwind: '$adress'},
            // {
            //     $project:{
            //         adress: '$adress.adress'
            //     }
            // }
            
        ])
        .toArray()
        await con.close();
        res.send (data);
    }catch (err){
        res.status(500).send({error});
    }
})

app.get ('/users/name', async (req,res)=>{
    try{
        const con = await client.connect();
        const data = await con.db ('People').collection ('users').aggregate([
            {$match:{}},
            {$group:{_id: '$name'}}
        ])
        .toArray()
        await con.close();
        res.send (data);
    }catch (err){
        res.status(500).send({error});
    }
})

app.get ('/users/email', async (req,res)=>{
    try{
        const con = await client.connect();
        const data = await con.db ('People').collection ('users').aggregate([
            {$match:{}},
            {$group:{_id: '$name', email:{$push:"$email"}}},
        ])
        .toArray()
        await con.close();
        res.send (data);
    }catch (err){
        res.status(500).send({error});
    }
})

app.listen (port,()=>{
    console.log (`It works on ${port} port`);
})