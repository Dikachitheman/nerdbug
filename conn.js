const { MongoClient } = require('mongodb');

// using connection string here to avoid having to send them seperately if they were in an env file
const uri = 'mongodb+srv://dikachianosike:password900900@cluster0.a8fzitw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();
  db = client.db('user-api');
  console.log('Connected to MongoDB');
}

connectDB() // test node conn.js

function getDB() {
  if (!db) throw new Error('DB not connected');
  return db;
}

module.exports = { connectDB, getDB };
