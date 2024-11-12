const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const connections = {

}

const models = {

}

const bankUserSchema = new mongoose.Schema({});

let dbName = "bleh";

const getConnection = async (dbName) => {
    if(connections != dbName) {
        connections[dbName] = await mongoose.createConnection(process.env.MONGO_URI, { dbName: dbName })
        console.log("a new database has been created for dbName");
    }
    else {
        console.log("reusing existing connection for dbName")
    }
    return connections[dbName];
}

const getModel = async (dbName, collectionName) => {
    console.log("getModel called with:", { dbName, collectionName });
    const modelKey = `${dbName}-${collectionName}`;
    if (!models[modelKey]) {
    const connection = await getConnection(dbName);
    // Create a dynamic schema that accepts any fields
    const dynamicSchema = new mongoose.Schema({}, { strict: false });
    models[modelKey] = connection.model(collectionName, dynamicSchema,collectionName 
    // Use exact collection name from request
    );
console.log("Created new model for collection:", collectionName);
}
return models[modelKey];
};

app.get("/find/:database/:collection", async (req,res) => {
    try {
        const {database, collection} = req.params
        const Model = await getModel(database, collection)
        const document = await model.find({})
        console.log(`query executed, document count is ${documents.length}`)
        res.status(200).json(documents)
    }
    catch{error} {
        console.error("error in GET route: ", err);
        res.status(500).json({error: error.message})
    }
    }
);

async function startServer() {
    try{
        app.listen(PORT, () => {
            console.log(``)
        })
    }
    catch(err) {
        console.error(`Error starting error:`, err)
        process.exit(1)
    }
}

startServer()