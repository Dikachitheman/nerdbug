const { getDB } = require('./conn');
const collectionName = 'users';

async function createUser(name, email, id) {
    const db = getDB();
    const existing = await db.collection('users').findOne({ email });
  
    if (existing) {
      throw new Error('Email must be unique.');
    }
  
    const user = { idx: id, name, email };
    await db.collection('users').insertOne(user);
    return id;
  }

async function getUserById(id) {
  const db = getDB();
  const { ObjectId } = require('mongodb');
  return await db.collection(collectionName).findOne({ idx: new ObjectId(id) });
}

async function getAllUsers() {
  const db = getDB();
  return await db.collection(collectionName).find().toArray();
}

async function deleteUser(id) {
  const db = getDB();
  const { ObjectId } = require('mongodb');
  const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  deleteUser,
};