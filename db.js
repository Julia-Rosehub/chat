const { MongoClient } = require("mongodb");

let db;

exports.connectToDb = async () => {
    const url = process.env.DB_URL || 'mongodb://localhost/recipe_db';
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
    db.collection('contacts')
        .find()
        .toArray((error, data) => {
            if (error) throw error;
            console.log(data);
        });
}